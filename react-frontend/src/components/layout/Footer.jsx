import { CircleCheck } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Gestión de Usuarios · Desarrollo de Aplicaciones Web</span>
      <span className="footer-badges">
        <span><CircleCheck /> Node.js + Express</span>
        <span><CircleCheck /> SQL Server 2022</span>
      </span>
    </footer>
  );
}

export default Footer;
