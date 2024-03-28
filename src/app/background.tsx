export function BackgroundDrop() {
    return (
        <>
            <div className="flex flex-col w-screen h-full">
                <div className="absolute z-0 w-full h-full">
                    <div className={'h-backdrop-sm w-backdrop-sm md:h-backdrop md:w-backdrop bg-blue-500 rounded-full ml-auto absolute left-10'}></div>   
                    <div className={`h-backdrop-sm w-backdrop-sm md:h-backdrop md:w-backdrop bg-orange-500 rounded-full ml-auto absolute bottom-0`}></div>
                    <div className={`h-backdrop-sm w-backdrop-sm md:h-backdrop md:w-backdrop bg-red-500 rounded-full absolute right-0 top-20`}></div>
                    <div className={`h-backdrop-sm w-backdrop-sm md:h-backdrop md:w-backdrop bg-yellow-500 rounded-full absolute left-[50%] top-[50%] md:top-[30%]`}></div>
                </div>
            <div className="flex absolute z-10 bg-white/75 backdrop-blur-[70px] md:backdrop-blur-[100px] w-screen h-full">

            </div>
            </div>
        </>
    )
}