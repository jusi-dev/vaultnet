import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { Header } from "./header";

import { Toaster } from "@/components/ui/toaster"
import { Footer } from "./Footer";
import Script from "next/script";

const inter = Roboto({ weight: ["100", "300", "400", "500", "700", "900"], style: "normal", preload: false });

export const metadata: Metadata = {
  title: "VaultNet - The Swiss Dropbox Alternative",
  description: "VaultNet is the most secure and flexible storage solution in Switzerland. Store your files securely and privately in the heart of the Swiss Alps. VaultNet is the best alternative to Dropbox and Google Drive.",
  keywords: "vaultnet, storage, switzerland, secure, private, flexible, cheap, easy, dropbox, alternative",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body className={` ${inter.className } m-0 p-0 w-screen`}>
        <ConvexClientProvider>
          <Toaster />
          <Header />
          {children}
          <Footer />
        </ConvexClientProvider>

        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
          __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '492793676571323');
          fbq('track', 'PageView');
          `,
          }}
        />
      </body>
    </html>
  );
}