/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom"
import { setCredentials } from "../../Redux/Slice/authSlice";


const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const avatar = searchParams.get('avatar');

        if(token)
        {
            dispatch(setCredentials({
                token,
                user: {name, email, avatar}
            }))
            navigate('/dashboard');
        }

        else
        {
            navigate('/login');
        }
    }, [])

    return(
        <div className="min-h-screen bg-[#0d1321] flex items-center justify-center">
            <p className="text-[#dde2f6]">Signing you in...</p>
        </div>
    )
}

export default AuthCallback;