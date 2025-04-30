
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Guard, PatrolLog } from '@/lib/types';
import { Shield, Clock, Map, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function GuardList() {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockGuards: Guard[] = [
        {
          id: '1',
          name: 'Michael Brown',
          phone: '+1 (555) 111-2222',
          shift: 'morning',
          status: 'on-duty',
        },
        {
          id: '2',
          name: 'James Wilson',
          phone: '+1 (555) 333-4444',
          shift: 'evening',
          status: 'on-duty',
        },
        {
          id: '3',
          name: 'Emily Davis',
          phone: '+1 (555) 555-6666',
          shift: 'night',
          status: 'off-duty',
        },
      ];
      
      setGuards(mockGuards);
      setLoading(false);
    }, 1000);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'morning': return 'Morning (6AM - 2PM)';
      case 'evening': return 'Evening (2PM - 10PM)';
      case 'night': return 'Night (10PM - 6AM)';
      default: return shift;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {guards.map((guard) => (
        <Card key={guard.id} className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-slide-in-bottom">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={guard.image} alt={guard.name} />
                <AvatarFallback className="bg-primary/10 text-primary">{getInitials(guard.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-medium flex items-center">
                  {guard.name}
                  <Badge 
                    variant={guard.status === 'on-duty' ? 'default' : 'outline'} 
                    className="ml-2 h-5 text-xs py-0"
                  >
                    {guard.status === 'on-duty' ? 'On Duty' : 'Off Duty'}
                  </Badge>
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock size={14} />
                  <span>{getShiftLabel(guard.shift)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Shield size={14} />
                  <span>{guard.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PatrolLogList() {
  const [logs, setLogs] = useState<PatrolLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockLogs: PatrolLog[] = [
        {
          id: '1',
          guardId: '1',
          guardName: 'Michael Brown',
          timestamp: '2023-05-15T08:30:00',
          location: 'Building A, Front Entrance',
          status: 'normal',
        },
        {
          id: '2',
          guardId: '2',
          guardName: 'James Wilson',
          timestamp: '2023-05-15T14:45:00',
          location: 'Building B, Parking Area',
          status: 'normal',
        },
        {
          id: '3',
          guardId: '1',
          guardName: 'Michael Brown',
          timestamp: '2023-05-15T10:15:00',
          location: 'Garden Area',
          notes: 'Broken bench needs repair',
          status: 'incident',
        },
        {
          id: '4',
          guardId: '2',
          guardName: 'James Wilson',
          timestamp: '2023-05-15T16:00:00',
          location: 'Swimming Pool',
          status: 'normal',
        },
      ];
      
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id} className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-slide-in-bottom">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{log.location}</h3>
                  {log.status === 'incident' && (
                    <Badge variant="destructive" className="h-5 text-xs py-0">Incident</Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    <span>{log.guardName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatDate(log.timestamp)}</span>
                  </div>
                  {log.notes && (
                    <div className="flex items-start gap-1 mt-2">
                      <FileText size={14} className="mt-0.5" />
                      <span>{log.notes}</span>
                    </div>
                  )}
                </div>
              </div>
              {log.status === 'normal' ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <AlertTriangle size={18} className="text-amber-500" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function LogPatrolForm() {
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isIncident, setIsIncident] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ location, notes, isIncident });
    // Would submit the form data here
    setLocation('');
    setNotes('');
    setIsIncident(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Log Patrol</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <div className="flex items-center">
              <Map size={16} className="text-muted-foreground mr-2" />
              <Input
                id="location"
                placeholder="Enter patrol location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </label>
            <div className="flex items-center">
              <FileText size={16} className="text-muted-foreground mr-2" />
              <Input
                id="notes"
                placeholder="Any observations or issues?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="incident"
              checked={isIncident}
              onChange={(e) => setIsIncident(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="incident" className="text-sm font-medium">
              Report as incident
            </label>
          </div>
          
          <Button type="submit" className="w-full">
            <Shield size={16} className="mr-2" />
            Log Patrol
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
