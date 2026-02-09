import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom";

import { formatUserFullName } from "@/utils/formats";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    }
    return (
        <nav className="sticky top-0 bg-[#101922] p-4 text-white border-b border-[#1e293b] flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">Firmer Intern Quest Logging System</h1>

            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-[#94a3b8]">Welcome <strong>{formatUserFullName(user.prefix, user.firstname, user.lastname)}</strong></span>
                    <Button onClick={handleLogout} className="text-sm text-[#f87171] hover:bg-[#b91c1c]/40 bg-transparent border border-[#f87171]">
                        <LogOut />
                    </Button>
                </div>
            )}
        </nav>
    )
}

export default Navbar