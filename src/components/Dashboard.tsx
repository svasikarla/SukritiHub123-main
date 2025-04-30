
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Shield, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { Statistic } from '@/lib/types';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  to?: string;
}

const DashboardCard = ({ title, value, description, icon, trend, to }: DashboardCardProps) => {
  const cardContent = (
    <Card className="overflow-hidden group hover:border-primary/20 transition-all duration-300 h-full">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription>{description}</CardDescription>}
        {trend && (
          <div className={`text-xs flex items-center mt-1 ${trend.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value > 0 ? <CheckCircle size={12} className="mr-1" /> : <AlertTriangle size={12} className="mr-1" />}
            {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`} {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (to) {
    return <Link to={to} className="block h-full">{cardContent}</Link>;
  }
  
  return cardContent;
};

export function DashboardStats() {
  const [stats, setStats] = useState<Statistic[]>([]);

  useEffect(() => {
    // Simulating data fetching
    const statsData: Statistic[] = [
      { 
        label: 'Total Residents', 
        value: 248, 
        change: 5, 
        icon: 'Users'
      },
      { 
        label: 'Visitors Today', 
        value: 14, 
        change: 12, 
        icon: 'UserPlus'
      },
      { 
        label: 'Guards On Duty', 
        value: 6, 
        change: 0, 
        icon: 'Shield'
      },
      { 
        label: 'Pending Payments', 
        value: 8, 
        change: -10, 
        icon: 'DollarSign'
      },
    ];
    
    setStats(statsData);
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    Users: <Users size={18} />,
    UserPlus: <UserPlus size={18} />,
    Shield: <Shield size={18} />,
    DollarSign: <DollarSign size={18} />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
      {stats.map((stat, index) => (
        <DashboardCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          icon={iconMap[stat.icon || 'Users']}
          trend={{ value: stat.change || 0, label: 'from last month' }}
          to={index === 0 ? '/residents' : index === 1 ? '/visitors' : index === 2 ? '/guards' : '/vendors'}
        />
      ))}
    </div>
  );
}

export function RecentActivity() {
  const activities = [
    { id: 1, type: 'visitor', text: 'John Doe approved for entry at Gate 1', time: '20 minutes ago' },
    { id: 2, type: 'payment', text: 'Payment of $2,500 received from Garden Maintenance', time: '1 hour ago' },
    { id: 3, type: 'guard', text: 'Guard Patrol completed at Block C', time: '3 hours ago' },
    { id: 4, type: 'resident', text: 'New resident registered in Unit A-303', time: '5 hours ago' },
    { id: 5, type: 'visitor', text: 'Delivery from Amazon arrived at Gate 2', time: '6 hours ago' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'visitor': return <UserPlus size={16} className="text-blue-500" />;
      case 'payment': return <DollarSign size={16} className="text-green-500" />;
      case 'guard': return <Shield size={16} className="text-purple-500" />;
      case 'resident': return <Users size={16} className="text-orange-500" />;
      default: return <UserPlus size={16} className="text-blue-500" />;
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events in your society</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="mt-0.5">{getIcon(activity.type)}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActions() {
  const actions = [
    { title: 'Add Resident', icon: <Users size={16} />, to: '/residents' },
    { title: 'Approve Visitor', icon: <UserPlus size={16} />, to: '/visitors' },
    { title: 'Log Guard Patrol', icon: <Shield size={16} />, to: '/guards' },
    { title: 'Add Payment', icon: <DollarSign size={16} />, to: '/vendors' },
  ];

  return (
    <Card className="col-span-1 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="inline-flex items-center justify-center gap-2 p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200"
            >
              {action.icon}
              <span className="text-sm font-medium">{action.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingVisits() {
  const visits = [
    { name: 'Package Delivery', time: '11:00 AM', unit: 'A-501' },
    { name: 'Plumber Visit', time: '02:30 PM', unit: 'C-202' },
    { name: 'Sarah Williams', time: '04:00 PM', unit: 'B-103' },
  ];

  return (
    <Card className="animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
      <CardHeader className="pb-2">
        <CardTitle>Today's Visits</CardTitle>
        <CardDescription>Upcoming visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {visits.map((visit, i) => (
            <div key={i} className="flex justify-between items-center p-2 hover:bg-muted rounded-md transition-colors">
              <div>
                <p className="font-medium text-sm">{visit.name}</p>
                <p className="text-xs text-muted-foreground">Unit: {visit.unit}</p>
              </div>
              <div className="text-sm">{visit.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
