// components/Footer.tsx
import ThemeSwitcher from "@/components/ThemeSwitcher";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content p-4 mt-10 flex justify-between items-center">
      <div className="ml-4">
        <ThemeSwitcher />
      </div>
      <p className="flex-1 text-center">&copy; 2024 Viba Blog. All rights reserved.</p>
    </footer>
  );
};

export default Footer;