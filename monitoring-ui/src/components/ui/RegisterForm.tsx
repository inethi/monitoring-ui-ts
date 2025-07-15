import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import ButtonLoading from "@/components/ui/ButtonLoading";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const { register, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = username.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(username, password);
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto mt-20">
      <CardHeader>
        <CardTitle>Register your iNethi account</CardTitle>
        <CardDescription>
          Enter your iNethi username and password to register
        </CardDescription>
        <CardAction>
          <Button variant="link" type="button" onClick={onSwitch}>
            Login
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="reg-username">Username</Label>
            <Input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="your username"
              autoComplete="username"
            />
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="your password"
              autoComplete="current-password"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-5 text-muted-foreground hover:bg-transparent"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <CardFooter className="flex-col gap-2 p-0">
            {loading ? (
              <ButtonLoading disabled />
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !canSubmit}
              >
                Register
              </Button>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
