import Footer from "../_components/common/footer";
import LoginIntro from "../_components/common/login-intro";
import Navbar from "../_components/common/navbar";

export default function Page() {
  return (
    <div className="flex-1 p-0">
      <Navbar />
      <LoginIntro />
      <div className="font-mono text-xs text-muted-foreground">
        {/* (Press <kbd>d</kbd> to toggle dark mode) */}
      </div>
      <Footer />
    </div>
  );
}
