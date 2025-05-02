
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CheckCircle, Smartphone, FileText, Mail, Download, Camera } from 'lucide-react';

export function QrGenerator() {
  const [visitorName, setVisitorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleGenerateQr = () => {
    // In a real implementation, this would actually generate a QR code
    setQrGenerated(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Generate Visitor QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {!qrGenerated ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="visitor-name" className="text-sm font-medium block mb-1">
                Visitor Name
              </label>
              <input
                id="visitor-name"
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter visitor name"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="purpose" className="text-sm font-medium block mb-1">
                Purpose of Visit
              </label>
              <input
                id="purpose"
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter purpose of visit"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleGenerateQr}
              disabled={!visitorName || !purpose}
            >
              <QrCode size={16} className="mr-2" />
              Generate QR Code
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-4 p-2 border border-border rounded-md">
              <QrCode size={180} className="text-primary" />
            </div>
            <h3 className="font-medium text-center">{visitorName}</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">{purpose}</p>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Mail size={16} className="mr-1" />
                Email
              </Button>
            </div>
            
            <Button 
              className="w-full mt-4" 
              variant="ghost"
              onClick={() => {
                setQrGenerated(false);
                setVisitorName('');
                setPurpose('');
              }}
            >
              Generate Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QrCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [visitorData, setVisitorData] = useState<{name: string, purpose: string} | null>(null);

  const handleStartScan = () => {
    setScanning(true);
    // Simulate successful scan after 3 seconds
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setVisitorData({
        name: "Sarah Williams",
        purpose: "Personal visit"
      });
    }, 3000);
  };

  const handleNewScan = () => {
    setScanned(false);
    setVisitorData(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Scan Visitor QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {!scanning && !scanned ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 border-2 border-dashed border-border rounded-md flex items-center justify-center mb-4">
              <QrCode size={64} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to scan a visitor's QR code for entry
            </p>
            <Button onClick={handleStartScan}>
              <Camera size={16} className="mr-2" />
              Start Scanning
            </Button>
          </div>
        ) : scanning ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 border-2 border-primary rounded-md flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 border-t-2 border-primary animate-pulse-subtle"></div>
              <Camera size={64} className="text-primary animate-pulse" />
            </div>
            <p className="text-sm font-medium mb-4">
              Scanning... Point camera at QR code
            </p>
            <Button variant="outline" onClick={() => setScanning(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="font-medium text-center">Visitor Verified</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">QR code scanned successfully</p>
            
            <div className="w-full p-3 border border-border rounded-md mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{visitorData?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-muted-foreground" />
                <span className="text-sm">{visitorData?.purpose}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button>Check In</Button>
              <Button variant="outline" onClick={handleNewScan}>
                New Scan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
