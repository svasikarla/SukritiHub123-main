import React, { useState, useRef, useEffect } from 'react';
import { Database, Tables, Insertable } from '@/lib/database.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileImage, Check, AlertCircle, RefreshCw, Calendar, User, DollarSign, Home } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { useNavigate } from 'react-router-dom';

// Define interfaces for our data
type Resident = Tables<'residents'>;
type Apartment = Tables<'apartments'>;
type MaintenanceBill = Tables<'maintenance_bills'>;
type Payment = Tables<'payments'>;

// Extended types for our UI
interface ResidentWithUnit extends Resident {
  unit: string; // Computed property combining block and flat_number
  apartments?: Apartment | null;
  displayName: string; // Formatted name with unit for display in dropdown
}

interface ExtractedData {
  transactionId: string;
  amount: string;
  date: string;
  payerInfo: string;
  payeeName: string;
  upiId: string;
  month?: string;
}

const BookkeepingPayments = () => {
  // Add navigate hook
  const navigate = useNavigate();
  
  // State for file upload
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // State for OCR and data extraction
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  
  // State for residents and bills
  const [residents, setResidents] = useState<ResidentWithUnit[]>([]);
  const [selectedResident, setSelectedResident] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  
  // Add this state for payment history
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Toast notifications
  const { toast } = useToast();
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch residents on component mount
  useEffect(() => {
    console.log('BookkeepingPayments component mounted');
    fetchResidents();
    
    // Log the current state of residents after a short delay
    const timer = setTimeout(() => {
      console.log('Current residents state after delay:', residents);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch residents from Supabase with comprehensive apartment details
  const fetchResidents = async () => {
    console.log('Fetching residents...');
    try {
      // Using a more comprehensive query to get all resident and apartment details
      const { data, error } = await supabase
        .from('residents')
        .select(`
          id, name, email, phone, status, apartment_id,
          apartments:apartment_id (id, block, flat_number, flat_type, area_sqft)
        `);
      // Removed the status filter to see if there are any residents at all
      // .eq('status', 'active');
      
      console.log('Residents query result:', { data, error });
      
      if (error) {
        console.error('Error in residents query:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Found residents:', data.length);
        // Transform the data to include a unit property and display name
        const residentsWithUnit = data.map(resident => {
          const unit = resident.apartments 
            ? `${resident.apartments.block}-${resident.apartments.flat_number}` 
            : 'No Unit Assigned';
          
          const displayName = resident.apartments 
            ? `${resident.name} (${resident.apartments.block}-${resident.apartments.flat_number})` 
            : `${resident.name} (No Unit)`;
          
          return {
            ...resident,
            unit,
            displayName
          };
        }) as ResidentWithUnit[];
        
        console.log('Processed residents with units:', residentsWithUnit);
        setResidents(residentsWithUnit);
        
        // If we have extracted data from OCR, try to match a resident
        if (extractedData && extractedData.payerInfo) {
          matchResidentFromOCR(extractedData, residentsWithUnit);
        }
      } else {
        console.log('No residents found or empty data array');
        // Create some mock data for testing if no residents are found
        const mockResidents: ResidentWithUnit[] = [
          {
            id: 'mock-1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            status: 'active',
            apartment_id: 'apt-1',
            unit: 'A-101',
            displayName: 'John Doe (A-101)',
            apartments: {
              id: 'apt-1',
              block: 'A',
              flat_number: '101',
              flat_type: '2BHK',
              area_sqft: 1200,
              status: 'occupied',
              created_at: new Date().toISOString(),
              floor_number: 1
            }
          },
          {
            id: 'mock-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '8765432109',
            status: 'active',
            apartment_id: 'apt-2',
            unit: 'B-202',
            displayName: 'Jane Smith (B-202)',
            apartments: {
              id: 'apt-2',
              block: 'B',
              flat_number: '202',
              flat_type: '3BHK',
              area_sqft: 1500,
              status: 'occupied',
              created_at: new Date().toISOString(),
              floor_number: 2
            }
          }
        ];
        
        console.log('Setting mock residents for testing:', mockResidents);
        setResidents(mockResidents);
        
        toast({
          title: 'Using Test Data',
          description: 'No residents found in database. Using test data instead.',
        });
      }
    } catch (error) {
      console.error('Error fetching residents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load residents data. Check console for details.',
        variant: 'destructive',
      });
    }
  };
  
  // Function to match resident from OCR extracted data
  const matchResidentFromOCR = (extractedData: ExtractedData, residents: ResidentWithUnit[]) => {
    console.log("Attempting to match resident from OCR data:", extractedData);
    
    // Don't try to match if we don't have payer info or UPI ID
    if (!extractedData.payerInfo && !extractedData.upiId) {
      console.log("No payer info or UPI ID to match with");
      return;
    }
    
    let bestMatch: ResidentWithUnit | null = null;
    let bestMatchScore = 0;
    
    // Try to match based on various criteria
    for (const resident of residents) {
      let score = 0;
      
      // Match by name (case insensitive partial match)
      if (extractedData.payerInfo && resident.name) {
        const payerInfo = extractedData.payerInfo.toLowerCase();
        const residentName = resident.name.toLowerCase();
        
        // Check if resident name appears in payer info
        if (payerInfo.includes(residentName)) {
          score += 5; // Strong match
        } else {
          // Check for partial name matches (first name, last name)
          const payerWords = payerInfo.split(/\s+/);
          const residentWords = residentName.split(/\s+/);
          
          for (const payerWord of payerWords) {
            for (const residentWord of residentWords) {
              if (payerWord === residentWord && payerWord.length > 2) { // Avoid matching short words
                score += 3;
              } else if (payerWord.includes(residentWord) && residentWord.length > 2) {
                score += 2;
              } else if (residentWord.includes(payerWord) && payerWord.length > 2) {
                score += 2;
              }
            }
          }
        }
      }
      
      // Match by email/UPI ID
      if (extractedData.upiId && resident.email) {
        const upiId = extractedData.upiId.toLowerCase();
        const email = resident.email.toLowerCase();
        
        // Direct match
        if (upiId === email) {
          score += 10; // Very strong match
        } else {
          // Extract username part of email and UPI ID
          const upiUsername = upiId.split('@')[0];
          const emailUsername = email.split('@')[0];
          
          if (upiUsername === emailUsername) {
            score += 8; // Strong match on username
          } else if (upiUsername.includes(emailUsername) || emailUsername.includes(upiUsername)) {
            score += 5; // Partial match on username
          }
        }
      }
      
      // Match by phone number if available in payer info or UPI ID
      if (resident.phone) {
        const phone = resident.phone.replace(/[\s-]/g, ''); // Remove spaces and dashes
        const last10 = phone.slice(-10); // Get last 10 digits (standard mobile number length in India)
        
        // Check in payer info
        if (extractedData.payerInfo) {
          if (extractedData.payerInfo.includes(last10)) {
            score += 8; // Strong match
          } else {
            // Check for last 6 digits match (more reliable than just 4)
            const last6 = phone.slice(-6);
            if (extractedData.payerInfo.includes(last6)) {
              score += 4; // Better partial match
            } else {
              // Check for last 4 digits match
              const last4 = phone.slice(-4);
              if (extractedData.payerInfo.includes(last4)) {
                score += 2; // Weak partial match
              }
            }
          }
        }
        
        // Check in UPI ID (common in Indian UPI IDs like 9876543210@upi)
        if (extractedData.upiId) {
          if (extractedData.upiId.includes(last10)) {
            score += 8; // Strong match
          } else {
            const last6 = phone.slice(-6);
            if (extractedData.upiId.includes(last6)) {
              score += 4; // Partial match
            }
          }
        }
      }
      
      // Update best match if this resident has a higher score
      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = resident;
      }
    }
    
    // If we found a good match (score > threshold), select that resident
    if (bestMatch && bestMatchScore >= 5) { // Increased threshold for more confidence
      console.log(`Found resident match: ${bestMatch.displayName} with score ${bestMatchScore}`);
      setSelectedResident(bestMatch.id);
      
      toast({
        title: 'Resident Matched',
        description: `Automatically matched to ${bestMatch.displayName} based on payment details.`,
      });
    } else {
      console.log("No strong resident match found");
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.includes('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, etc.).',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      setFile(selectedFile);
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Reset states
      setExtractedData(null);
      setOcrConfidence(0);
      setProcessingStatus('');
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Process image with OCR
  const processImage = async () => {
    if (!file || !previewUrl) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Preparing image for processing...');
    setUploadProgress(10);

    try {
      // Compress image before processing
      const compressedImageBlob = await compressImage(file);
      const compressedImageUrl = URL.createObjectURL(compressedImageBlob);
      
      setProcessingStatus('Extracting text from image...');
      setUploadProgress(30);

      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(
        compressedImageUrl,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setUploadProgress(30 + Math.round(m.progress * 50));
            }
          }
        }
      );

      setProcessingStatus('Analyzing extracted text...');
      setUploadProgress(80);
      
      // Extract relevant information
      const extractedText = result.data.text;
      const confidence = result.data.confidence;
      setOcrConfidence(confidence);
      
      // Parse the extracted text to find UPI details
      const extracted = parseUpiDetails(extractedText);
      setExtractedData(extracted);
      
      setProcessingStatus('Processing complete!');
      setUploadProgress(100);
      
      toast({
        title: 'Image processed',
        description: `Text extracted with ${confidence.toFixed(2)}% confidence.`,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Processing failed',
        description: 'Failed to extract text from the image.',
        variant: 'destructive',
      });
      setProcessingStatus('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Compress image to improve processing speed
  const compressImage = async (imageFile: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 1200px width/height)
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round(height * (maxDimension / width));
            width = maxDimension;
          } else {
            width = Math.round(width * (maxDimension / height));
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas with new dimensions
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with reduced quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.7 // Quality (0.7 = 70%)
        );
      };
      
      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };
    });
  };

  // Parse UPI details from extracted text
  const parseUpiDetails = (text: string): ExtractedData => {
    console.log("Parsing OCR text:", text);
    
    // Normalize text - remove extra spaces, convert to single case for matching
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    // Initialize with empty values
    const data: ExtractedData = {
      transactionId: '',
      amount: '',
      date: '',
      payerInfo: '',
      payeeName: '',
      upiId: '',
    };
    
    // Define robust pattern matchers based on the sample UPI receipts
    // Transaction ID patterns
    const transactionIdPatterns = [
      /(?:UPI transaction ID|UPI Ref|Ref No|Transaction ID)[:\s]+([A-Za-z0-9]+)/i,
      /UTR[:\s]+([0-9]+)/i,
      /T[0-9]{20,}/i, // PhonePe specific format (T25050205362948966034486)
      /Google transaction ID[:\s]*([A-Za-z0-9]+)/i, // Google Pay transaction ID
      /[A-Za-z0-9]{10,}/i // Fallback for any long alphanumeric string
    ];
    
    // Amount patterns
    const amountPatterns = [
      /₹\s*([0-9,]+(\.[0-9]{2})?)/i, // ₹3,700 or ₹3,700.00
      /([0-9,]+)\s*₹/i, // 3,700₹ (reversed order)
      /(?:Amount|Rs|INR|Paid)[:\s]*([0-9,]+(\.[0-9]{2})?)/i ,// Amount: 3,700
      /(?:Amount|Rs|₹|INR|Paid)[:\s]*([0-9,.]+)/i,
      /([0-9]+,[0-9]+\.[0-9]+)/i, // Format: 1,234.56
      /([0-9]+\.[0-9]+)/i,         // Format: 1234.56
      /₹\s*([0-9,]+)/i,            // Format: ₹3,700 (with comma but no decimal)
      /₹([0-9]+)/i,                // Format: ₹3700 (without comma or decimal)
      /\s*([0-9,]+)/i,            // Format: 3,700 (with comma but no decimal)
      /([0-9]+)/i,                // Format: 3700 (without comma or decimal)
    ];
    
    // Date patterns
    const datePatterns = [
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/i, // 2 May 2025
      /(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i, // 2 May 2025 (full month)
      /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i, // DD/MM/YYYY or MM/DD/YYYY
      /(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4},\s+\d{1,2}:\d{2}\s*(?:am|pm))/i // 4 Apr 2025, 9:01 am
    ];
    
    // Payee/Recipient name patterns - generic for any apartment building
    const payeePatterns = [
      // Match common patterns for society/apartment payments
      /(?:Paid to|To)[:\s]+([A-Za-z0-9\s]+(?:WELFARE|ASSOCIATION|SOCIETY|APARTMENT|COMPLEX|RESIDENCY|TOWERS|ENCLAVE))/i,
      // General recipient pattern
      /(?:Paid to|To)[:\s]+([A-Za-z0-9\s]+)/i,
      // Fallback to any recipient after "To"
      /To ([A-Za-z0-9\s]+)/i
    ];
    
    // UPI ID patterns
    const upiIdPatterns = [
      /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+)/i // Standard UPI ID format
    ];
    
    // Payer info patterns
    const payerPatterns = [
      /From[:\s]+([A-Za-z0-9\s]+)/i,
      /Debited from[:\s]*([A-Za-z0-9\s]+)/i,
      /Google Pay[•\s]+([A-Za-z0-9._%+\-]+@[a-zA-Z0-9.\-]+)/i
    ];
    
    // Extract transaction ID
    for (const pattern of transactionIdPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        data.transactionId = match[1].trim();
        console.log("Found transaction ID:", data.transactionId);
        break;
      } else if (match && match[0] && !match[1]) {
        // For patterns that don't have a capture group
        data.transactionId = match[0].trim();
        console.log("Found transaction ID (no capture):", data.transactionId);
        break;
      }
    }
    
    // If no transaction ID found yet, look for UTR specifically
    if (!data.transactionId) {
      const utrMatch = normalizedText.match(/UTR[:\s]*([0-9]+)/i);
      if (utrMatch && utrMatch[1]) {
        data.transactionId = utrMatch[1].trim();
        console.log("Found UTR as transaction ID:", data.transactionId);
      }
    }
    
    // Extract amount
    for (const pattern of amountPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        // Clean up amount - remove commas
        data.amount = match[1].replace(/,/g, '');
        console.log("Found amount:", data.amount);
        break;
      }
    }
    
    // Extract date
    for (const pattern of datePatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[0]) {
        data.date = match[0].trim();
        console.log("Found date:", data.date);
        
        // Try to extract month for payment records
        try {
          // Convert various date formats to a standard one
          let dateObj: Date | null = null;
          
          // Try different date formats
          const dateFormats = [
            // 2 May 2025
            (dateStr: string) => {
              const parts = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
              if (parts) {
                const months = {
                  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
                  'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
                };
                const day = parseInt(parts[1]);
                const monthStr = parts[2].toLowerCase().substring(0, 3);
                const month = months[monthStr as keyof typeof months];
                const year = parseInt(parts[3]);
                if (!isNaN(day) && month !== undefined && !isNaN(year)) {
                  return new Date(year, month, day);
                }
              }
              return null;
            },
            // DD/MM/YYYY
            (dateStr: string) => {
              const parts = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
              if (parts) {
                const day = parseInt(parts[1]);
                const month = parseInt(parts[2]) - 1; // JS months are 0-based
                const year = parseInt(parts[3]);
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                  return new Date(year, month, day);
                }
              }
              return null;
            },
            // 4 Apr 2025, 9:01 am
            (dateStr: string) => {
              const parts = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),\s+(\d{1,2}):(\d{2})\s*(am|pm)/i);
              if (parts) {
                const months = {
                  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
                  'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
                };
                const day = parseInt(parts[1]);
                const monthStr = parts[2].toLowerCase().substring(0, 3);
                const month = months[monthStr as keyof typeof months];
                const year = parseInt(parts[3]);
                if (!isNaN(day) && month !== undefined && !isNaN(year)) {
                  return new Date(year, month, day);
                }
              }
              return null;
            }
          ];
          
          // Try each date format parser
          for (const parser of dateFormats) {
            dateObj = parser(data.date);
            if (dateObj) break;
          }
          
          if (dateObj && !isNaN(dateObj.getTime())) {
            // Format: "Month Year" (e.g., "May 2025")
            data.month = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
            console.log("Extracted payment month:", data.month);
          }
        } catch (e) {
          console.error("Error parsing date for month extraction:", e);
        }
        
        break;
      }
    }
    
    // Extract payee name
    for (const pattern of payeePatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        data.payeeName = match[1].trim();
        console.log("Found payee name:", data.payeeName);
        break;
      } else if (match && match[0] && !match[1]) {
        // Handle patterns without capture groups
        data.payeeName = match[0].trim();
        console.log("Found payee name (no capture):", data.payeeName);
        break;
      }
    }
    
    // Extract UPI ID
    for (const pattern of upiIdPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[0]) {
        data.upiId = match[0].trim().toLowerCase();
        console.log("Found UPI ID:", data.upiId);
        break;
      }
    }
    
    // Extract payer info
    for (const pattern of payerPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        data.payerInfo = match[1].trim();
        console.log("Found payer info:", data.payerInfo);
        break;
      }
    }
    
    // If we still don't have a transaction ID, try a line-by-line approach as fallback
    if (!data.transactionId) {
      const lines = text.split('\n');
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (
          lowerLine.includes('transaction id') || 
          lowerLine.includes('upi ref') || 
          lowerLine.includes('ref no') ||
          lowerLine.includes('utr')
        ) {
          // Extract alphanumeric sequence that might be a transaction ID
          const match = line.match(/[a-zA-Z0-9]{6,}/);
          if (match) {
            data.transactionId = match[0];
            console.log("Found transaction ID (fallback):", data.transactionId);
            break;
          }
        }
      }
    }
    
    // If no month was extracted from the date, use current month
    if (!data.month) {
      const now = new Date();
      data.month = now.toLocaleString('default', { month: 'long', year: 'numeric' });
      console.log("Using current month as fallback:", data.month);
    }
    
    console.log("Final extracted data:", data);
    return data;
  };

  // Save payment to Supabase
  const savePayment = async () => {
    if (!extractedData || !selectedResident || !selectedMonth) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Step 1: Try to upload the image to Supabase Storage, but continue if it fails
      setProcessingStatus('Uploading image...');
      setUploadProgress(20);
      
      const timestamp = new Date().getTime();
      const fileName = `payment_${selectedResident}_${timestamp}.jpg`;
      const filePath = `payments/${fileName}`;
      let imageUrl = ''; // Default to empty string in case upload fails
      
      if (!file) throw new Error('No file selected');
      
      try {
        // Try to upload the image
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('paymentreceipts')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        // If there's an error with the bucket, we'll continue without the image
        if (uploadError) {
          console.error('Error uploading receipt image:', uploadError);
          
          if (uploadError.statusCode === 404 && uploadError.message.includes('Bucket not found')) {
            toast({
              title: 'Storage Not Configured',
              description: 'The storage bucket for receipts has not been set up. Payment will be saved without the image.',
              variant: 'warning',
            });
          } else {
            toast({
              title: 'Upload Warning',
              description: 'Could not upload receipt image. Payment will be saved without the image.',
              variant: 'warning',
            });
          }
        } else {
          // If upload succeeded, get the public URL
          const { data: urlData } = await supabase.storage
            .from('paymentreceipts')
            .getPublicUrl(filePath);
          
          imageUrl = urlData.publicUrl;
          console.log('Receipt image uploaded successfully:', imageUrl);
        }
      } catch (uploadErr) {
        // Catch any other errors but continue with the payment process
        console.error('Exception during upload:', uploadErr);
      }
      
      setProcessingStatus('Processing payment details...');
      setUploadProgress(50);
      
      // Step 3: Find the maintenance bill for the selected resident and month
      const { data: billData, error: billError } = await supabase
        .from('maintenance_bills')
        .select('id, amount_due, status')
        .eq('resident_id', selectedResident)
        .eq('month_year', selectedMonth)
        .single();
      
      if (billError && billError.code !== 'PGRST116') {
        throw billError;
      }
      
      setProcessingStatus('Saving payment information...');
      setUploadProgress(70);
      
      // Parse amount to ensure it's a number
      const paidAmount = parseFloat(extractedData.amount);
      if (isNaN(paidAmount)) {
        throw new Error('Invalid payment amount');
      }
      
      // Step 4: If bill exists, update it; otherwise create a new one
      let billId: string;
      
      if (billData) {
        // Update existing bill
        const { error: updateError } = await supabase
          .from('maintenance_bills')
          .update({ status: 'Paid' })
          .eq('id', billData.id);
        
        if (updateError) throw updateError;
        billId = billData.id;
      } else {
        // Create new bill
        const newBillData: Insertable<'maintenance_bills'> = {
          resident_id: selectedResident,
          month_year: selectedMonth,
          amount_due: paidAmount,
          due_date: new Date().toISOString().split('T')[0], // Today's date
          status: 'Paid'
        };
        
        const { data: newBill, error: newBillError } = await supabase
          .from('maintenance_bills')
          .insert([newBillData])
          .select('id')
          .single();
        
        if (newBillError) throw newBillError;
        if (!newBill) throw new Error('Failed to create new bill');
        billId = newBill.id;
      }
      
      // Step 5: Create payment record with enhanced data
      // Format transaction ID to include UPI ID and payer info if available
      const formattedTransactionId = extractedData.transactionId || 
        `UPI: ${extractedData.upiId || 'Unknown'} | ${extractedData.payerInfo || 'Unknown'}`;
      
      // Create payment data object according to the actual database schema
      const paymentData: Insertable<'payments'> = {
        maintenance_bill_id: billId,
        paid_amount: paidAmount,
        paid_on: new Date().toISOString(),
        payment_mode: 'UPI',
        transaction_id: formattedTransactionId
      };
      
      // Add payment_screenshot if we successfully uploaded an image
      if (imageUrl) {
        paymentData.payment_screenshot = imageUrl;
      }
      
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([paymentData]);
      
      if (paymentError) throw paymentError;
      
      setUploadProgress(100);
      setProcessingStatus('Payment saved successfully!');
      
      toast({
        title: 'Success',
        description: 'Payment has been recorded successfully.',
      });
      
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setExtractedData(null);
      setSelectedResident('');
      setSelectedMonth('');
      
    } catch (error: any) {
      console.error('Error saving payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save payment information.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Generate month options (last 12 months)
  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      months.push(monthYear);
    }
    
    return months;
  };

  // Add this function to fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      setLoadingHistory(true);
      
      // Fetch payments with related maintenance bill and resident information
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id, 
          paid_amount, 
          paid_on, 
          payment_mode, 
          transaction_id,
          payment_screenshot,
          maintenance_bills:maintenance_bill_id (
            id,
            month_year,
            resident_id,
            residents:resident_id (
              id,
              name,
              apartments:apartment_id (
                block,
                flat_number
              )
            )
          )
        `)
        .order('paid_on', { ascending: false });
      
      if (error) throw error;
      
      setPaymentHistory(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment history.',
        variant: 'destructive',
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  // Call this when the component mounts or when the tab changes
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Payment Upload</h1>
          <p className="text-muted-foreground">Upload UPI payment receipts and process them automatically</p>
        </div>
        
        {/* Add Back to Dashboard button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <Home size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload UPI Payment Screenshot</CardTitle>
                <CardDescription>Upload a screenshot of your UPI payment confirmation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${
                    previewUrl ? 'border-primary/50' : 'border-muted-foreground/25'
                  }`}
                  onClick={handleUploadClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isProcessing || isUploading}
                  />
                  
                  {previewUrl ? (
                    <div className="space-y-4 w-full">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-muted">
                        <img 
                          src={previewUrl} 
                          alt="Payment receipt" 
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        {file?.name} ({Math.round(file?.size / 1024)} KB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <FileImage className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Drag & drop or click to upload</p>
                      <p className="text-xs text-muted-foreground">
                        Supports JPG, PNG (max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleUploadClick}
                      disabled={isProcessing || isUploading}
                    >
                      Change Image
                    </Button>
                    <Button 
                      onClick={processImage}
                      disabled={isProcessing || isUploading || !file}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Extract Details
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {(isProcessing || isUploading) && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">{processingStatus}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  {extractedData 
                    ? 'Review and confirm the extracted payment details' 
                    : 'Upload and process an image to extract payment details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractedData ? (
                  <>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transaction-id">Transaction ID</Label>
                          <div className="flex">
                            <Input 
                              id="transaction-id" 
                              value={extractedData.transactionId} 
                              onChange={(e) => setExtractedData({...extractedData, transactionId: e.target.value})}
                              placeholder="Transaction ID"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₹)</Label>
                          <div className="flex">
                            <Input 
                              id="amount" 
                              value={extractedData.amount} 
                              onChange={(e) => setExtractedData({...extractedData, amount: e.target.value})}
                              placeholder="Amount"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Payment Date</Label>
                          <div className="flex">
                            <Input 
                              id="date" 
                              value={extractedData.date} 
                              onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                              placeholder="DD/MM/YYYY"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payer-info">Payer Information</Label>
                          <div className="flex">
                            <Input 
                              id="payer-info" 
                              value={extractedData.payerInfo} 
                              onChange={(e) => setExtractedData({...extractedData, payerInfo: e.target.value})}
                              placeholder="Payer Info"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resident">Resident</Label>
                        <Select 
                          value={selectedResident} 
                          onValueChange={setSelectedResident}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select resident" />
                          </SelectTrigger>
                          <SelectContent>
                            {residents.map((resident) => (
                              <SelectItem key={resident.id} value={resident.id}>
                                {resident.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="month">Month</Label>
                        <Select 
                          value={selectedMonth} 
                          onValueChange={setSelectedMonth}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {getMonthOptions().map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {ocrConfidence > 0 && (
                        <Alert className={ocrConfidence > 80 ? "bg-green-50" : "bg-amber-50"}>
                          {ocrConfidence > 80 ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          )}
                          <AlertTitle>OCR Confidence: {ocrConfidence.toFixed(2)}%</AlertTitle>
                          <AlertDescription>
                            {ocrConfidence > 80 
                              ? "High confidence in extracted data. Please verify before saving." 
                              : "Low confidence in extracted data. Please review and correct any errors."}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Payment Processed</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Upload a UPI payment screenshot and click "Extract Details" to automatically process the payment information.
                    </p>
                  </div>
                )}
              </CardContent>
              {extractedData && (
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={savePayment} 
                    disabled={isUploading || !selectedResident || !selectedMonth}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save Payment
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>View recent payment uploads and their status</CardDescription>
              </div>
              <Button variant="outline" onClick={fetchPaymentHistory} disabled={loadingHistory}>
                {loadingHistory ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => {
                    const resident = payment.maintenance_bills?.residents;
                    const apartment = resident?.apartments;
                    const unitDisplay = apartment ? `${apartment.block}-${apartment.flat_number}` : 'No Unit';
                    
                    return (
                      <Card key={payment.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{resident?.name || 'Unknown Resident'}</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <User size={14} />
                                <span>{unitDisplay}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar size={14} />
                                <span>{new Date(payment.paid_on).toLocaleDateString()}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {payment.transaction_id}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-lg">₹{payment.paid_amount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <span>{payment.maintenance_bills?.month_year || 'Unknown Period'}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="rounded-full bg-muted p-3 mx-auto mb-4 w-fit">
                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Payment History</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Payment history will be displayed here once payments are processed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookkeepingPayments;
