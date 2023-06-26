import React, { useMemo } from 'react'
import { avatarColors } from '../../../../constants/appConstants'

const ProfileBadge: React.FC<{ size?: string, username: string, className?: string }> = ({ size = '100', username, className }) => {

    let sizepx = `${size}px`;
    //Temp will replace with contect Data for profile and local storage in useEffect
    const { color, initial, fontSize } = useMemo(() => {
        let firstAlphabet = username?.charAt(0).toUpperCase() || 'S';
        const asciiCodeIndex = firstAlphabet.charCodeAt(0) - 65;
        let fontSize = `${(+size / 2)}px`;
        return { color: avatarColors.at(asciiCodeIndex)!, initial: firstAlphabet, fontSize };
    }, [username, size]);

    const styles: React.CSSProperties = {
        width: sizepx,
        height: sizepx,
        backgroundColor: color
    }

    return (
        <div title={username} className={"profile-picture rounded-circle fw-bold text-white d-flex align-items-center justify-content-center text-center " + className} style={{ ...styles, backgroundColor: color }} >
            <span style={{ fontSize: fontSize }}>{initial}</span>
        </div>
    )
}

export default ProfileBadge