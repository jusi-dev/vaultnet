export default function Contact () {
    return (
        <div className="container flex flex-col w-full justify-center mx-auto my-20 min-h-[50vh]">
            <h1 className="text-3xl md:text-5xl text-orange-500 text-center font-extrabold">
                Contact Us
            </h1>
            <p className="text-center text-gray-500 mt-2">
                We are happy to help you!
            </p>
            <div className="container mt-6">
                <p className="text-gray-700 text-center text-lg">We're here to help with all your security and networking needs. Whether you have a question about our services, need technical support, or just want to give feedback, feel free to reach out to us.</p>
                <p className="font-semibold text-center text-3xl text-orange-500 mt-16">Contact informations</p>
                <div className="flex flex-col md:flex-row mt-4 items-center justify-center">
                    <div className="flex flex-col w-full md:w-1/2 text-center">
                        <p className="text-gray-700 text-lg font-medium">Email: 
                            <a href="mailto:support@vaultnet.ch" className="text-orange-500 ml-2">support@vaultnet.ch</a>
                        </p>
                        <p className="text-gray-700 text-lg font-medium">Phone: 
                            <a href="tel:+41446681818" className="text-orange-500 ml-2">+41 44 668 18 18</a>
                        </p>
                        <p className="text-gray-700 text-lg font-medium">Address: 
                            <span className="text-orange-500 ml-2">Winistörfer Webdesign, Solothurnstrasse 7, 4543 Deitingen, Switzerland</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}