import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"

function Login() {
    const { login, isAuthenticated, loading } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loadingLogin, setLoadingLogin] = useState(false);

    const navigate = useNavigate();

    // Redirect to logs page if already logged in
    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, loading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setError("");
        setLoadingLogin(true);

        try {
            await login(username.trim(), password.trim());
        } catch (error) {
            setError("Invalid username or password");
            console.error("Login error:", error);
        } finally {
            setLoadingLogin(false);
        }
    }

    return (
        <div className="bg-[#101922] min-h-screen flex flex-col gap-4 items-center justify-center">
            <h1 className="text-white text-3xl font-bold text-center">Firmer Intern Quest Logging System</h1>
            <div className='w-100 h-auto bg-[#162033] border-t-2 border-[#137fec] rounded-lg shadow-lg p-8'>
                <div className="w-full mb-4">
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="username" className="text-[#94a3b8] font-bold">Username</label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                className="mb-4 bg-[#0f172a] text-white"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-[#94a3b8] font-bold">Password</label>
                            <InputGroup className="bg-[#0f172a] text-white">
                                <InputGroupInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton type="button" variant="ghost" onClick={() => setShowPassword(!showPassword)} className="hover:bg-[#162033]">
                                        {showPassword ? <EyeOff className="text-white" /> : <Eye className="text-white" />}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        {error && <div className="text-red-500 mt-2">{error}</div>}

                        <Button type="submit" disabled={loadingLogin} className="w-full mt-6 bg-[#137fec] hover:bg-[#0e5edb] disabled:opacity-50">
                            {loadingLogin ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login