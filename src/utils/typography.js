import Typography from 'typography'
import theme from 'typography-theme-ocean-beach'
theme.overrideThemeStyles = ({ rhythm }, options) => ({})

const typography = new Typography(theme)

export default typography
