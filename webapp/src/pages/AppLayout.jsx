import { useEffect, useState } from 'react'
import { isAuthenticated } from '../handlers/authHandler'
import { useNavigate, Outlet } from 'react-router-dom'
import Loading from '../components/Loading'
import TopNav from '../components/TopNav'
import SideBar from '../components/SideBar'
import { Box, Toolbar, colors } from '@mui/material'

const AppLayout = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkToken = async () => {
            const response = await isAuthenticated()
            if (!response) return navigate('/login')
            setIsLoading(false)
        }
        checkToken()
    }, [])

    return (
        isLoading ? (
            <Box sx={{ width: '100%', height: '100vh' }}>
                <Loading />
            </Box>
        ) : (
            <Box>
                <TopNav/>
                <Box sx={{display: 'flex'}}>
                    <SideBar/>
                    <Box
                        component='main'
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            backgroundColor: colors.grey['100'],
                            width: 'max-content'
                        }}
                    >
                        <Toolbar/>
                        <Outlet/>
                    </Box>
                </Box>
            </Box>
        )
        
    )
}

export default AppLayout
