import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import './Loader.css'

function Loader({ fullScreen = false }) {
  return (
    <Box className={fullScreen ? 'loader-container-fullscreen' : 'loader-container'}>
      <Box className="loader-content">
        <CircularProgress size={48} thickness={4} color="primary" />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Cargando...
        </Typography>
      </Box>
    </Box>
  )
}

export default Loader
