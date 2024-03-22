export function BackgroundDrop() {
    return (
        <>
            <div className="h-full w-full absolute z-0">
                <div className="h-64 w-64 bg-purple-500 rounded-full ml-auto relative mr-10 mt-24"></div>
                <div className="h-64 w-64 bg-purple-500 rounded-full relative ml-32 -mt-20"></div>
                <div className="h-64 w-64 bg-purple-500 rounded-full relative mx-auto"></div>
            </div>
            <div className="flex w-full h-full absolute z-10 bg-white/75 backdrop-blur-[100px]">

            </div>
        </>
    )
}