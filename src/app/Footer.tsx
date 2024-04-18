import Link from "next/link";
import Image from "next/image";
import { MailCheckIcon } from "lucide-react";
import { InstagramOutlined, LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
import { PaymentElement } from "@stripe/react-stripe-js";

export function Footer() {
    return <div className="py-20 bg-orange-400 mt-12 flex flex-col items-center">
        <div className="container mx-auto flex flex-col md:flex-row gap-y-8 justify-between text-white ">
            <div className="mr-14">
                <Link href={"/"} className="flex items-center gap-2 font-bold text-2xl cursor-pointer text-white">
                    <Image src="/logo-faultnet.png" width={50} height={30} alt="VaultNet" />
                    VaultNet
                </Link>
                <p className="font-light mt-4 w-60">Explore why VaultNet is the most powerful storage solution on the market!</p>
            </div>
            <div className="flex flex-col">
                <p className="font-semibold text-xl mb-4">Service</p>
                <Link className="cursor-pointer" href="/subscriptions">Subscriptions</Link>
                <Link className="cursor-pointer" href="/faq">FAQ</Link>
            </div>
            <div className="flex flex-col">
                <p className="font-semibold text-xl mb-4">Company</p>
                <Link className="cursor-pointer" href="/about">About Us</Link>
                <Link className="cursor-pointer" href="/terms">Terms of Service</Link>
                <Link className="cursor-pointer" href="/privacy">Privacy Policy</Link>
                <Link href="/terms" className="cursor-pointer">Imprint</Link>
            </div>
            <div className="flex flex-col">
                <p className="font-semibold text-xl mb-4">Get in touch</p>
                <p className="flex gap-2"><MailCheckIcon /> support@vaultnet.ch</p>
                <div className="mt-4 flex gap-x-3">
                    <InstagramOutlined className="cursor-pointer text-3xl" />
                    <TwitterOutlined className="cursor-pointer text-3xl" />
                    <LinkedinOutlined className="cursor-pointer text-3xl" />
                </div>
            </div>
        </div>
        <div className="container mx-auto flex flex-col items-center">
            <hr className="w-full border-white mt-8" />
            <div className="flex gap-2 mt-8">
                <Image src="/payment/klarna.svg" width={50} height={20} alt="Stripe" />
                <Image src="/payment/apple-pay.svg" width={50} height={20} alt="Apple Pay" />
                <Image src="/payment/google-pay.svg" width={50} height={20} alt="Google Pay" />
                <Image src="/payment/visa.svg" width={50} height={20} alt="Visa" />
                <Image src="/payment/mastercard-alt.svg" width={50} height={20} alt="Mastercard" />
                <Image src="/payment/american-express.svg" width={50} height={20} alt="American Express" />
            </div>
            <p className="text-center text-white mt-4">© 2024 VaultNet. All rights reserved.</p>
        </div>
    </div>
}