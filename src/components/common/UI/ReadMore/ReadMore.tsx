
const ReadMore: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const text = children?.toString();
    const LENGTH = 120;
    return (
        <div className="text">
            {text?.slice(0, LENGTH)} {(text && text?.length > LENGTH) && <span className="text-primary pointer-cursor fw-normal">...Read more</span>}
        </div>
    );
}

export default ReadMore