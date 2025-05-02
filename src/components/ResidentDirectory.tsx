import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Phone, Mail, Home, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Resident } from '@/lib/types';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface ResidentSearchProps {
  onSearch: (term: string) => void;
}

export function ResidentSearch({ onSearch }: ResidentSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };
  
  return (
    <div className="w-full max-w-md relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        placeholder="Search residents..."
        className="pl-10 h-10 focus-visible:ring-primary/25 bg-white"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}

interface ResidentListProps {
  className?: string;
  residentType?: string;
  searchTerm?: string;
}

// Type for the resident from Supabase with apartments join
type ResidentWithApartment = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  apartment_id: string | null;
  status: string | null;
  created_at: string | null;
  apartments?: {
    id: string;
    block: string;
    flat_number: string;
    floor_number: number | null;
    flat_type: string | null;
  } | null;
};

export function ResidentList({ className, residentType, searchTerm = '' }: ResidentListProps) {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isAddingResident, setIsAddingResident] = useState(false);
  const [newResident, setNewResident] = useState({
    name: '',
    email: '',
    phone: '',
    apartment_id: ''
  });
  const [availableApartments, setAvailableApartments] = useState<{id: string, displayName: string}[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<{
    checking: boolean;
    connected: boolean;
    error?: string;
  }>({
    checking: true,
    connected: false
  });

  // Check Supabase connection on component mount
  useEffect(() => {
    async function verifyConnection() {
      setConnectionStatus({ checking: true, connected: false });
      try {
        const { success, error } = await checkSupabaseConnection();
        if (success) {
          setConnectionStatus({ checking: false, connected: true });
        } else {
          setConnectionStatus({ 
            checking: false, 
            connected: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      } catch (err) {
        setConnectionStatus({ 
          checking: false, 
          connected: false, 
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }
    verifyConnection();
  }, []);

  useEffect(() => {
    fetchResidents();
    fetchApartments();
  }, []);

  // Apply search and type filters
  useEffect(() => {
    let result = residents;
    
    // Filter by type if provided
    if (residentType) {
      if (residentType === 'inactive') {
        result = result.filter(resident => resident.status === 'inactive');
      } else {
        result = result.filter(resident => resident.type === residentType && resident.status === 'active');
      }
    }
    
    // Use either the external searchTerm or internal localSearchTerm
    const term = searchTerm || localSearchTerm;
    
    // Filter by search term
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      result = result.filter(resident => 
        resident.name.toLowerCase().includes(lowercaseTerm) || 
        resident.email.toLowerCase().includes(lowercaseTerm) || 
        resident.phone.toLowerCase().includes(lowercaseTerm) || 
        resident.unit.toLowerCase().includes(lowercaseTerm)
      );
    }
    
    setFilteredResidents(result);
  }, [residents, residentType, searchTerm, localSearchTerm]);

  async function fetchResidents() {
    try {
      console.log('Fetching residents...');
      // Fetch residents from Supabase
      const { data, error } = await supabase
        .from('residents')
        .select(`
          id, 
          name, 
          email, 
          phone, 
          status, 
          created_at, 
          apartment_id, 
          apartments (
            id, 
            block, 
            flat_number, 
            floor_number, 
            flat_type
          )
        `)
        .order('name');

      console.log('Residents data:', data);
      console.log('Residents error:', error);

      if (error) {
        console.error('Error fetching residents:', error);
        alert('Error fetching residents: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        // Map Supabase data to Resident type
        const mappedResidents: Resident[] = data.map((resident: ResidentWithApartment) => {
          console.log('Processing resident:', resident);
          return {
            id: resident.id,
            name: resident.name,
            email: resident.email || '',
            phone: resident.phone || '',
            unit: resident.apartments ? `${resident.apartments.block}-${resident.apartments.flat_number}` : 'N/A',
            moveInDate: resident.created_at ? new Date(resident.created_at).toISOString().split('T')[0] : '',
            status: (resident.status?.toLowerCase() === 'active') ? 'active' : 'inactive',
            // Default to 'owner' since we don't have this field in Supabase schema
            type: 'owner'
          };
        });

        console.log('Mapped residents:', mappedResidents);

        setResidents(mappedResidents);
        setFilteredResidents(mappedResidents);
      } else {
        console.log('No residents found or empty data array, inserting test data...');
        alert('No residents found. Attempting to insert test data.');
        // Insert test data directly here instead of calling a separate function
        try {
          console.log('Inserting test apartments...');
          const { data: apartments, error: apartmentsError } = await supabase
            .from('apartments')
            .insert([
              { block: 'A', flat_number: '101', floor_number: 1, flat_type: '2BHK', area_sqft: 1200, status: 'Occupied' },
              { block: 'A', flat_number: '102', floor_number: 1, flat_type: '3BHK', area_sqft: 1500, status: 'Occupied' },
              { block: 'B', flat_number: '201', floor_number: 2, flat_type: '1BHK', area_sqft: 850, status: 'Available' }
            ])
            .select();
          console.log('Inserted apartments:', apartments);
          if (apartmentsError) {
            console.error('Error inserting apartments:', apartmentsError);
            alert('Error inserting test apartments: ' + apartmentsError.message);
          } else if (apartments && apartments.length > 0) {
            console.log('Inserting test residents...');
            const { data: residents, error: residentsError } = await supabase
              .from('residents')
              .insert([
                { 
                  name: 'John Doe', 
                  email: 'john@example.com', 
                  phone: '9876543210', 
                  apartment_id: apartments[0].id, 
                  status: 'Active' 
                },
                { 
                  name: 'Jane Smith', 
                  email: 'jane@example.com', 
                  phone: '8765432109', 
                  apartment_id: apartments[1].id, 
                  status: 'Active' 
                }
              ])
              .select();
            console.log('Inserted residents:', residents);
            if (residentsError) {
              console.error('Error inserting residents:', residentsError);
              alert('Error inserting test residents: ' + residentsError.message);
            } else {
              // Fetch residents again after insertion
              fetchResidents();
              fetchApartments();
              return; // Exit to avoid setting empty arrays
            }
          }
        } catch (err) {
          console.error('Error inserting test data:', err);
          alert('Error inserting test data: ' + (err instanceof Error ? err.message : String(err)));
        }
        setResidents([]);
        setFilteredResidents([]);
      }
    } catch (err) {
      console.error('Error fetching residents:', err);
      alert('Error fetching residents: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  async function fetchApartments() {
    try {
      console.log('Fetching apartments...');
      const { data, error } = await supabase
        .from('apartments')
        .select('id, block, flat_number')
        .order('block, flat_number');

      console.log('Apartments data:', data);
      console.log('Apartments error:', error);

      if (error) {
        console.error('Error fetching apartments:', error);
        return;
      }

      if (data && data.length > 0) {
        // Format apartments for display
        const formattedApartments = data.map(apt => ({
          id: apt.id,
          displayName: `${apt.block}-${apt.flat_number}`
        }));
        console.log('Formatted apartments:', formattedApartments);
        setAvailableApartments(formattedApartments);
      } else {
        console.log('No apartments found');
        setAvailableApartments([]);
      }
    } catch (err) {
      console.error('Error fetching apartments:', err);
    }
  }
  
  const handleSearch = (term: string) => {
    setLocalSearchTerm(term);
  };
  
  const handleAddResident = () => {
    setIsAddingResident(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingResident(false);
    setNewResident({
      name: '',
      email: '',
      phone: '',
      apartment_id: ''
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewResident({
      ...newResident,
      [name]: value
    });
  };
  
  const handleSubmitNewResident = async () => {
    if (!newResident.name) {
      alert('Name is required');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('residents')
        .insert([
          {
            name: newResident.name,
            email: newResident.email || null,
            phone: newResident.phone || null,
            apartment_id: newResident.apartment_id || null,
            status: 'Active'
          }
        ])
        .select();
      
      if (error) {
        console.error('Error adding resident:', error);
        alert('Failed to add resident');
        return;
      }
      
      // Refresh residents list
      fetchResidents();
      
      // Reset form
      handleCancelAdd();
    } catch (err) {
      console.error('Error adding resident:', err);
      alert('Failed to add resident');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button size="sm" onClick={handleAddResident}>
        <Plus size={16} className="mr-1" />
        Add Resident
      </Button>

      {isAddingResident && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Add New Resident</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name*</label>
                <Input 
                  name="name"
                  value={newResident.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input 
                  name="email"
                  value={newResident.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <Input 
                  name="phone"
                  value={newResident.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Apartment</label>
                <select
                  name="apartment_id"
                  value={newResident.apartment_id}
                  onChange={(e) => setNewResident({...newResident, apartment_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select an apartment</option>
                  {availableApartments.map(apt => (
                    <option key={apt.id} value={apt.id}>
                      {apt.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelAdd}>Cancel</Button>
              <Button onClick={handleSubmitNewResident}>Save Resident</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="overflow-hidden animate-slide-in-bottom hover:shadow-medium transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={resident.image} alt={resident.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">{getInitials(resident.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{resident.name}</h3>
                    <Badge variant={resident.type === 'owner' ? 'default' : 'secondary'} className="text-xs">
                      {resident.type === 'owner' ? 'Owner' : 'Tenant'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Home size={14} />
                    <span>{resident.unit}</span>
                  </div>
                  <div className="flex flex-col space-y-1 text-sm mt-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone size={14} />
                      <span>{resident.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Mail size={14} />
                      <span className="truncate max-w-[200px]">{resident.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card 
          className="overflow-hidden border-dashed border-2 flex items-center justify-center h-[144px] animate-slide-in-bottom cursor-pointer hover:border-primary/50 transition-colors"
          onClick={handleAddResident}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Plus size={24} className="mb-2" />
            <span className="text-sm font-medium">Add Resident</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
