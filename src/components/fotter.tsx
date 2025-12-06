 import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Tools Section */}
        <div>
          <h4 className="font-bold mb-4">TOOLS</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#">AI Image Generator</Link>
            </li>
            <li>
              <Link href="#">AI Video Generator</Link>
            </li>
            <li>
              <Link href="#">Image Upscaler</Link>
            </li>
            <li>
              <Link href="#">Background Remover</Link>
            </li>
            <li>
              <Link href="#">Photo Editor</Link>
            </li>
            <li>
              <Link href="#">AI Voice Generator</Link>
            </li>
            <li>
              <Link href="#">All Freepik Tools</Link>
            </li>
          </ul>
        </div>

        {/* Information Section */}
        <div>
          <h4 className="font-bold mb-4">INFORMATION</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#">Pricing</Link>
            </li>
            <li>
              <Link href="#">About Us</Link>
            </li>
            <li>
              <Link href="#">API</Link>
            </li>
            <li>
              <Link href="#">Jobs</Link>
            </li>
            <li>
              <Link href="#">Sell Content</Link>
            </li>
            <li>
              <Link href="#">Events</Link>
            </li>
            <li>
              <Link href="#">Search Trends</Link>
            </li>
            <li>
              <Link href="#">Blog</Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h4 className="font-bold mb-4">LEGAL</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#">Terms of Use</Link>
            </li>
            <li>
              <Link href="#">License Agreement</Link>
            </li>
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#">Copyright Information</Link>
            </li>
            <li>
              <Link href="#">Cookies Policy</Link>
            </li>
            <li>
              <Link href="#">Cookie Settings</Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="font-bold mb-4">SUPPORT</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#">FAQ</Link>
            </li>
            <li>
              <Link href="#">Search Guide</Link>
            </li>
            <li>
              <Link href="#">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Social Media and Signup */}
        <div>
          <h4 className="font-bold mb-4">SOCIAL MEDIA</h4>
          <div className="flex space-x-4 mb-4">
            <Link href="#">
              <img
                src="/icons/facebook.svg"
                alt="Facebook"
                className="h-6 w-6"
              />
            </Link>
            <Link href="#">
              <img src="/icons/twitter.svg" alt="Twitter" className="h-6 w-6" />
            </Link>
            <Link href="#">
              <img
                src="/icons/pinterest.svg"
                alt="Pinterest"
                className="h-6 w-6"
              />
            </Link>
            <Link href="#">
              <img
                src="/icons/instagram.svg"
                alt="Instagram"
                className="h-6 w-6"
              />
            </Link>
            <Link href="#">
              <img src="/icons/youtube.svg" alt="YouTube" className="h-6 w-6" />
            </Link>
            <Link href="#">
              <img
                src="/icons/linkedin.svg"
                alt="LinkedIn"
                className="h-6 w-6"
              />
            </Link>
            <Link href="#">
              <img src="/icons/discord.svg" alt="Discord" className="h-6 w-6" />
            </Link>
            <Link href="#">
              <img src="/icons/reddit.svg" alt="Reddit" className="h-6 w-6" />
            </Link>
          </div>
          <div>
            <p className="mb-2">
              Get exclusive assets sent straight to your inbox
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center">
        <p className="text-sm">
          © 2010-2024 Freepik Company S.L. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
