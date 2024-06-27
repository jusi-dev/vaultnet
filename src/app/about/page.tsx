export default function TermsOfService() {
    return(
        <div className="container md:w-2/4 my-32">
            <h2 className="mt-10 text-5xl text-orange-500">About Us</h2>
            <p className="mt-6">Welcome to VaultNet, your premier destination for secure, scalable, and Swiss-based cloud storage. Our mission is to revolutionize how individuals and businesses manage their digital assets with an uncompromising focus on security, privacy, and cost-efficiency.</p>

            <div>
                <p className="text-3xl text-orange-500 mt-6 font-semibold">Who We Are</p>
                <p>VaultNet was born out of a need for reliable and straightforward cloud storage solutions. We understand the frustrations with complex pricing models and opaque data policies of other providers. That’s why we’ve developed a platform that is transparent, easy to use, and grounded in the robust legal framework of Switzerland.</p>
            </div>

            <div>
                <p className="text-3xl text-orange-500 mt-6 font-semibold">Our Vision</p>
                <p>Our vision is to empower individuals and businesses to take control of their data. We believe that data privacy is a fundamental human right and that everyone should have access to secure and affordable cloud storage. We are committed to providing our customers with the tools they need to protect their digital assets and ensure their long-term security.</p>
            </div>

            <div>
                <p className="text-3xl text-orange-500 mt-6 font-semibold">Our Values</p>
                <ul className="list-disc ml-8 mt-4 gap-y-2 flex flex-col">
                    <li><span className="font-medium text-orange-600">Security: </span> Your data is stored exclusively within Switzerland, under one of the world's most stringent privacy regimes. We leverage advanced encryption and security protocols to ensure your data is safe from unauthorized access.</li>
                    <li><span className="font-medium text-orange-600">Flexibility: </span>Our Pay-As-You-Go pricing model means you only pay for what you use, with no hidden fees or long-term contracts. This ensures that you can scale your storage seamlessly as your needs grow.</li>
                    <li><span className="font-medium text-orange-600">Reliability: </span>With a commitment to 99.999999999% durability, VaultNet guarantees the persistence of your data. Our infrastructure is designed to keep your files accessible and safe at all times.</li>
                    <li><span className="font-medium text-orange-600">Scalable: </span>Whether you’re an individual or a large enterprise, we have a plan that fits your needs.</li>
                    <li><span className="font-medium text-orange-600">Ease of Use: </span>We’ve created an intuitive interface that makes managing your files straightforward. Whether you’re sharing with a small team or a large organization, VaultNet simplifies your data management.</li>
                </ul>
            </div>

            <div>
                <p className="text-3xl text-orange-500 mt-6 font-semibold">Why Choose VaultNet?</p>
                <p>When you choose VaultNet, you’re choosing a partner that is committed to your success. We are dedicated to providing you with the highest quality cloud storage solutions, backed by world-class security and customer support. With VaultNet, you can trust that your data is in safe hands.</p>
                <ul className="list-disc ml-8 mt-4 gap-y-2 flex flex-col">
                    <li><span className="font-medium text-orange-600">Swiss Precision and Security: </span>Benefit from the robust data privacy laws of Switzerland.</li>
                    <li><span className="font-medium text-orange-600">Cost-Effective: </span>Our flexible pricing ensures you’re never paying for more storage than you need.</li>
                    <li><span className="font-medium text-orange-600">User-Friendly: </span>Designed to be accessible and efficient for users of all technical backgrounds.</li>
                    <li><span className="font-medium text-orange-600">Custom Solutions: </span>Experience custom solutions for you business needs.</li>
                </ul>
            </div>

            <div>
                <p className="text-3xl text-orange-500 mt-6 font-semibold">Join Us</p>
                <p>At VaultNet, we believe in making data storage as seamless and secure as possible. Join the growing number of individuals and businesses who trust VaultNet with their data. Explore our services and find the perfect plan to meet your needs.</p>
                <p className="mt-4">Start your journey with us today at <a href="/subscriptions" className="text-orange-500">VaultNet </a> and discover the future of cloud storage.</p>
            </div>
        </div>
    )
}