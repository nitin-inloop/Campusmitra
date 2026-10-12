import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function Register() {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await registerUser(data.username, data.email, data.password);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-white rounded-full blur-[150px] opacity-[0.02] point-events-none -z-10" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-12">
          <Link to="/" className="text-sm font-medium tracking-tighter uppercase opacity-50 hover:opacity-100 transition-opacity">
            ← Back to Platform
          </Link>
        </div>
        
        <Card className="bg-[#0a0a0a]">
          <CardHeader className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardTitle className="text-4xl mb-4">
                Initialize User
              </CardTitle>
              <CardDescription>
                Create a new clearance profile for CampusMitra network.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleFormSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Select handled identifier"
                  {...register("username")}
                  disabled={loading}
                  className={errors.username ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter contact vector"
                  {...register("email")}
                  disabled={loading}
                  className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create strong security key"
                  {...register("password")}
                  disabled={loading}
                  className={errors.password ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-3 animate-spin"/>
                    Initializing...
                  </span>
                ) : (
                  <>
                    Request Access <ArrowRight className="w-4 h-4 ml-3" />
                  </>
                )}
              </Button>
            </motion.form>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <span className="text-[#666] text-sm mr-2">Already have clearance?</span>
              <Link
                to="/login"
                className="text-white text-sm hover:underline transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
