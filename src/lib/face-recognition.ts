
import { supabase } from "@/integrations/supabase/client";

/**
 * Interface for maid data
 */
export interface Maid {
  id: number;
  "Name of Maid": string;
  "Face Descriptor": number[] | null;
  apartment_unit?: string;
  phone_number?: string;
}

/**
 * Interface for maid attendance record
 */
export interface MaidAttendance {
  id: number;
  maid_id: number;
  entry_time: string;
  exit_time?: string;
  apartment_unit?: string;
  status: 'checked-in' | 'checked-out';
  face_match_confidence?: number;
}

/**
 * Fetch all registered maids from the database
 */
export async function fetchMaids() {
  const { data, error } = await supabase
    .from('Maids')
    .select('*');
  
  if (error) {
    console.error('Error fetching maids:', error);
    throw error;
  }
  
  return data as Maid[];
}

/**
 * Verify face against registered maids
 * 
 * In a real implementation, this would use a face recognition API/library
 * Here we're using a simplified mock version
 */
export async function verifyFace(imageData: string) {
  try {
    // Validate image data
    if (!imageData || !imageData.startsWith('data:image/')) {
      return {
        success: false,
        message: 'Invalid image data. Please capture a valid photo.'
      };
    }
    
    // For demo purposes, we're using a mock implementation
    // In a real app, this would send the image to a face recognition API
    // and process the response
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get maids from database
    const maids = await fetchMaids();
    
    if (!maids.length) {
      return { 
        success: false, 
        message: 'No maids registered in the system' 
      };
    }
    
    // Mock verification - randomly succeed or fail with 70% success rate
    const isMatch = Math.random() < 0.7;
    
    if (isMatch) {
      // Randomly select a maid for the demo
      const randomIndex = Math.floor(Math.random() * maids.length);
      const matchedMaid = maids[randomIndex];
      
      const confidence = 75 + Math.floor(Math.random() * 20); // Random confidence between 75-95%
      
      return {
        success: true,
        maid: matchedMaid,
        confidence,
        message: `Matched with ${matchedMaid["Name of Maid"]} (${confidence}% confidence)`
      };
    } else {
      return {
        success: false,
        confidence: 30 + Math.floor(Math.random() * 40), // Random low confidence
        message: 'No match found for this face'
      };
    }
  } catch (error) {
    console.error('Face verification error:', error);
    return {
      success: false,
      message: 'Error during face verification. Please try again.'
    };
  }
}

/**
 * Record maid attendance in the database
 */
export async function recordAttendance(maidId: number, isCheckIn: boolean, confidence?: number) {
  try {
    if (isCheckIn) {
      // Record check-in
      const { data, error } = await supabase
        .from('Maid Attendance')
        .insert([{
          maid_id: maidId,
          status: 'checked-in',
          face_match_confidence: confidence
        }])
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } else {
      // Find the most recent check-in without a check-out
      const { data: openAttendance, error: fetchError } = await supabase
        .from('Maid Attendance')
        .select('*')
        .eq('maid_id', maidId)
        .eq('status', 'checked-in')
        .order('entry_time', { ascending: false })
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      if (!openAttendance || openAttendance.length === 0) {
        return { success: false, message: 'No open check-in found' };
      }
      
      // Update the record with check-out time
      const { data, error } = await supabase
        .from('Maid Attendance')
        .update({ 
          exit_time: new Date().toISOString(),
          status: 'checked-out',
          face_match_confidence: confidence
        })
        .eq('id', openAttendance[0].id)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error recording attendance:', error);
    return { success: false, error };
  }
}
