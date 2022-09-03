import { useRouter } from "next/router";

function withRouterHook(Component) {
  const router = useRouter()

  return function WrappedComponent(props) {
    const myHookValue = useMyHook();
    return <Component {...props} router={router} />;
  }
}