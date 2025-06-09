// src/components/footer.tsx
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 px-5 z-10 border-t border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="text-sm text-gray-400 mb-2 sm:mb-0">
          <p className="mt-1 text-xs text-gray-500">
            Học viện Công nghệ Bưu chính Viễn thông, 97 Man Thiện, phường Hiệp Phú, Thủ Đức, TP HCM.
          </p>
        </div>

        {/* Các liên kết điều hướng */}
        <nav className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm">
          <Link href="/about" className="hover:text-white transition-colors mb-1 sm:mb-0">
            Về chúng tôi
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors mb-1 sm:mb-0">
            Liên hệ
          </Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors mb-1 sm:mb-0">
            Chính sách bảo mật
          </Link>
          <Link href="/regulations" className="hover:text-white transition-colors mb-1 sm:mb-0">
            Nội quy nhà xe
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;