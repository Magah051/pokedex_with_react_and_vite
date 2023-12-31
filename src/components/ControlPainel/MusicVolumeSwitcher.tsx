import { DefaultVolumeSwitcher } from "./DefaultVolumeSwitcher"
import { useEffect, useRef, useState } from "react"
import { RiMusic2Fill } from "react-icons/ri";

export function MusicVolumeSwitcher() {

    const audioRef = useRef<HTMLAudioElement>(null)
    const [volume, setVolume] = useState<string>("0.0")

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = Number(volume)
            if (audioRef.current.paused) {
                audioRef.current.play()
            }
        }
    }, [volume])

    return <>
        <div>
            <DefaultVolumeSwitcher
                icon={<RiMusic2Fill />}
                volume={volume}
                setVolume={setVolume}
            />
            <audio
                ref={audioRef}
                src="/audios/music/pokecenter.mp3"
                loop
            />
        </div>
    </>
}
