
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WhatsappIcon } from "@/components/WhatsAppIntegration";
import { useToast } from "@/hooks/use-toast";

const WhatsAppIntegration = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [autoProcess, setAutoProcess] = useState(true);
  const { toast } = useToast();

  const handleConnect = () => {
    // This would actually connect to WhatsApp Business API
    if (whatsappNumber && apiKey) {
      setIsConnected(true);
      toast({
        title: "WhatsApp Connected",
        description: "Your WhatsApp Business account has been successfully connected.",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Please enter a valid WhatsApp number and API key.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "WhatsApp Disconnected",
      description: "Your WhatsApp Business account has been disconnected.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">WhatsApp Integration</h1>
          <p className="text-muted-foreground">Manage payment submissions via WhatsApp</p>
        </div>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Connect WhatsApp Business</CardTitle>
              <CardDescription>
                Link your WhatsApp Business account to receive payment notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <Alert className="bg-green-50 border-green-200">
                  <WhatsappIcon className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-800">Connected to WhatsApp Business</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your WhatsApp Business account is connected and ready to receive messages.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-number">WhatsApp Business Number</Label>
                    <Input
                      id="whatsapp-number"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">WhatsApp Business API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your WhatsApp Business API key"
                    />
                  </div>
                  <Button onClick={handleConnect} className="w-full">
                    <WhatsappIcon className="mr-2 h-4 w-4" />
                    Connect WhatsApp
                  </Button>
                </div>
              )}

              {isConnected && (
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect}
                  className="mt-4"
                >
                  Disconnect WhatsApp
                </Button>
              )}
            </CardContent>
          </Card>

          {isConnected && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>
                  Current status of your WhatsApp integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">0</p>
                          <p className="text-sm text-muted-foreground">Pending Payments</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">0</p>
                          <p className="text-sm text-muted-foreground">Processed Today</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                View and process incoming payment messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No messages received yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Residents can send payment screenshots or voice messages to your WhatsApp Business number
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Connect your WhatsApp Business account first</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('[value="setup"]')?.dispatchEvent(new Event('click'))}
                  >
                    Go to Setup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>WhatsApp Integration Settings</CardTitle>
              <CardDescription>
                Configure how WhatsApp messages are processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-process">Automatic Processing</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process payment screenshots and voice messages
                    </p>
                  </div>
                  <Switch
                    id="auto-process"
                    checked={autoProcess}
                    onCheckedChange={setAutoProcess}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="confirmation">Send Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Send payment confirmation messages to residents
                    </p>
                  </div>
                  <Switch
                    id="confirmation"
                    checked={true}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notification">Admin Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify administrators about new payment submissions
                    </p>
                  </div>
                  <Switch
                    id="notification"
                    checked={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>
                Configure payment processing settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-account">Default Payment Account</Label>
                  <select className="w-full px-3 py-2 border border-border rounded-md">
                    <option>Maintenance Fund</option>
                    <option>Sinking Fund</option>
                    <option>Utility Payments</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-threshold">Payment Verification Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="payment-threshold"
                      type="number"
                      defaultValue={5000}
                    />
                    <span className="whitespace-nowrap">INR</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payments above this amount will require manual verification
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default WhatsAppIntegration;
