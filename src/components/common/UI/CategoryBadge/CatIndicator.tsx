import "./CategoryBadge.scss"

const CatIndicator: React.FC<{ color?: string }> = (props) => {
    return <div className={`border border-2 border-${props.color} rounded-circle indicator px-1`}></div>
}

CatIndicator.defaultProps = {
    color: 'primary',
}

export default CatIndicator;