import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { bootstrapAuth } from "../../Redux/Slice/authActions.jsx";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFinalizing, setIsFinalizing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const finalizeLogin = async () => {
      const didRestoreSession = await dispatch(bootstrapAuth());

      if (!isMounted) {
        return;
      }

      setIsFinalizing(false);

      if (didRestoreSession) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    if (searchParams.get("error")) {
      navigate("/login", { replace: true });
      return () => {
        isMounted = false;
      };
    }

    finalizeLogin();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#0d1321] flex items-center justify-center">
      <p className="text-[#dde2f6] font-['Space_Grotesk'] text-lg">
        {isFinalizing ? "Completing your secure sign-in..." : "Redirecting..."}
      </p>
    </div>
  );
};

export default AuthCallback;
