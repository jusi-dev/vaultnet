import { useState } from "react";

export function CopyToClipboard({copyValue} : {copyValue: string}) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        });
    }

    return (
        <div className="grid grid-cols-8 gap-2 w-full max-w-[23rem]">
            <label htmlFor="npm-install" className="sr-only">Label</label>
            <input id="npm-install" type="text" className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={copyValue} disabled readOnly />
            <button onClick={() => copyToClipboard(copyValue)} className="col-span-2 text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center items-center inline-flex justify-center">
                {!isCopied ?
                    <span id="default-message">Copy</span>
                :
                    <span id="success-message" className="inline-flex items-center">
                        <svg className="w-3 h-3 text-white me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                        Copied!
                    </span>
                }
            </button>
        </div>
    )
}