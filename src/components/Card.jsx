export default function Card({ title, content, color = "blue", icon: Icon }) {
    const borderColors = {
        blue: "!border-l-blue-500",
        green: "!border-l-green-500",
        purple: "!border-l-purple-500",
        red: "!border-l-red-500",
        yellow: "!border-l-yellow-500",
    };

    const textColors = {
        blue: "text-blue-500",
        green: "text-green-500",
        purple: "text-purple-500",
        red: "text-red-500",
        yellow: "text-yellow-500",
    };

    const borderColorClass = borderColors[color] || borderColors.blue;
    const textColorClass = textColors[color] || textColors.blue;

    return (
        <div className={`p-4 bg-[var(--bg-card)] rounded shadow-sm hover:shadow-md transition-shadow border-l-4 ${borderColorClass} border-[var(--border-color)]`}>
            {Icon && <Icon className={`text-4xl mb-3 ${textColorClass}`} />}
            <h3 className={`font-bold mb-2 text-lg text-[var(--text-primary)]`}>{title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{content}</p>
        </div>
    );
}
