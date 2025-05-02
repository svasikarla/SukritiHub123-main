import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Check, X, RefreshCw, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { verifyFace, recordAttendance } from '@/lib/face-recognition';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DomesticHelpVerification() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'check-in' | 'check-out'>('check-in');
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then(status => {
          setPermissionStatus(status.state as 'prompt' | 'granted' | 'denied');
          
          status.onchange = () => {
            setPermissionStatus(status.state as 'prompt' | 'granted' | 'denied');
          };
        })
        .catch(err => {
          console.error('Permission API error:', err);
        });
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      if ((error as DOMException).name === 'NotAllowedError') {
        setPermissionStatus('denied');
        setErrorMessage('Camera access denied. Please allow camera access in your browser settings.');
      } else if ((error as DOMException).name === 'NotFoundError') {
        setErrorMessage('No camera found. Please connect a camera and try again.');
      } else {
        setErrorMessage('Unable to access camera. Please check permissions and try again.');
      }
      
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        
        stopCamera();
      }
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setVerificationData(null);
    setAttendanceRecorded(false);
    startCamera();
  };

  const verifyImage = async () => {
    if (!capturedImage) return;
    
    setIsVerifying(true);
    
    try {
      const result = await verifyFace(capturedImage);
      
      if (result.success) {
        setVerificationResult('success');
        setVerificationData(result);
        toast({
          title: "Verification Successful",
          description: result.message,
        });
      } else {
        setVerificationResult('failed');
        setVerificationData(result);
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationResult('failed');
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "An error occurred during the verification process.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const recordMaidAttendance = async () => {
    if (!verificationData?.maid?.id) return;
    
    try {
      const result = await recordAttendance(
        verificationData.maid.id,
        mode === 'check-in',
        verificationData.confidence
      );
      
      if (result.success) {
        setAttendanceRecorded(true);
        toast({
          title: `${mode === 'check-in' ? 'Check-in' : 'Check-out'} Recorded`,
          description: `${verificationData.maid["Name of Maid"]} has been ${mode === 'check-in' ? 'checked in' : 'checked out'} successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: `${mode === 'check-in' ? 'Check-in' : 'Check-out'} Failed`,
          description: result.message || "Could not record attendance.",
        });
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not record attendance due to a system error.",
      });
    }
  };

  const renderPermissionUI = () => {
    if (permissionStatus === 'denied') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Camera Access Denied</AlertTitle>
          <AlertDescription>
            <p className="mb-2">You've denied camera access. To use this feature, you need to allow camera access in your browser settings.</p>
            <p className="text-sm">Instructions: 
              <ul className="list-disc pl-5 mt-1">
                <li>Click the camera/lock icon in your browser's address bar</li>
                <li>Change the camera permission to "Allow"</li>
                <li>Refresh the page</li>
              </ul>
            </p>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <Tabs defaultValue="verification" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="verification">Face Verification</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Domestic Help Verification</CardTitle>
                  <CardDescription>Verify identity using face recognition</CardDescription>
                </div>
                <Select 
                  value={mode} 
                  onValueChange={(value) => setMode(value as 'check-in' | 'check-out')}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="check-in">
                      <div className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Check In</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="check-out">
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Check Out</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {renderPermissionUI()}
              
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              <div className="relative overflow-hidden rounded-lg border bg-background aspect-video">
                {isCameraActive && (
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
                
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {!isCameraActive && !capturedImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Camera className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {verificationResult === 'success' && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-full">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                )}
                
                {verificationResult === 'failed' && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-full">
                      <X className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                )}
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              {!isCameraActive && !capturedImage && (
                <Button 
                  className="w-full" 
                  onClick={startCamera}
                  disabled={permissionStatus === 'denied'}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              )}
              
              {isCameraActive && (
                <Button className="w-full" onClick={captureImage}>
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              )}
              
              {capturedImage && verificationResult === null && (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={resetCamera}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake Photo
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={verifyImage} 
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {verificationResult === 'success' && !attendanceRecorded && (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={resetCamera}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Over
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={recordMaidAttendance}
                  >
                    {mode === 'check-in' ? (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Record Check-in
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Record Check-out
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {(verificationResult === 'failed' || attendanceRecorded) && (
                <Button variant="outline" className="w-full" onClick={resetCamera}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {verificationResult === 'success' && verificationData && (
            <Alert className="mt-4">
              <Check className="h-4 w-4" />
              <AlertTitle>Verification Successful</AlertTitle>
              <AlertDescription>
                <p className="mb-1">Matched with <strong>{verificationData.maid["Name of Maid"]}</strong></p>
                <p className="text-sm text-muted-foreground">Confidence: {verificationData.confidence}%</p>
                {verificationData.maid.apartment_unit && (
                  <p className="text-sm text-muted-foreground">Unit: {verificationData.maid.apartment_unit}</p>
                )}
                {attendanceRecorded && (
                  <p className="text-sm font-medium text-green-600 mt-2">
                    ✓ {mode === 'check-in' ? 'Check-in' : 'Check-out'} recorded successfully
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {verificationResult === 'failed' && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                {verificationData?.message || 
                  "No match found in the registered domestic help database. Please verify again or contact society office."}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Domestic help check-ins and check-outs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm italic text-center py-8">
                  Attendance log will be displayed here.
                  <br />
                  Use the Face Verification tab to record attendance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
