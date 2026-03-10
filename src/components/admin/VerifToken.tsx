import { useAdminAuth } from "@/services/admin/useAdminAuth";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";
import Unauthorized_404 from "./Unauthorized_404";

function VerifToken() {
  const { jwtToken, ready } = useAdminAuth();
  if (!ready) return <SkeletonPleaseWait />;
  if (!jwtToken) return <Unauthorized_404 />;
}

export default VerifToken;
