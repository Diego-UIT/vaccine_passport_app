import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { PageHeader } from '../components'
import { Grid, Card, CardHeader, CardContent, CardActions, Button, Typography, FormControl, TextField} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import userApi from '../api/userApi'
import moment from 'moment'

const QRScan = () => {
    const [onLoadUser, setOnLoadUser] = useState(false)
    const [user, setUser] = useState()
    
    const handleError = (err) => {
        console.log(err)
    }
    const handleScan = async (data) => {
        if (onLoadUser) return
        if (!data) return

        try {
            setOnLoadUser(true)
            const res = await userApi.getOne(data)
            console.log(res)
            setUser(res)
        } catch(err) {
            console.log(err)
        } finally {
            setOnLoadUser(false)
        }
    }

    return (
        <>
            <PageHeader title='Scan user QR'/>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <Card elevation={0}>
                        <CardContent>
                            <QrReader
                                delay={1000}
                                onError={(err) => handleError(err)}
                                onScan={(data) => handleScan(data)}
                                style={{width: '100%'}}
                                facingMode='user'
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                variant='contained'
                                disableElevation
                                onClick={() => setUser(null)}
                            >
                                Reset
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={9}>
                    <Card elevation={0}>
                        <CardHeader title={<Typography variant='h6'>
                            User info
                        </Typography>}/>
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    <FormControl>
                                        {
                                            user && <TextField
                                                label='Id card'
                                                variant='outlined'
                                                value={user.idNumber}
                                                inputProps={{ readOnly: true }}
                                            />
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl>
                                        {
                                            user && <TextField
                                                label='Fullname'
                                                variant='outlined'
                                                value={user.fullName}
                                                inputProps={{ readOnly: true }}
                                            />
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl>
                                        {
                                            user && <TextField
                                                label='Phone'
                                                variant='outlined'
                                                value={user.phoneNumber}
                                                inputProps={{ readOnly: true }}
                                            />
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl>
                                        {
                                            user && <TextField
                                                label='Address'
                                                variant='outlined'
                                                value={user.address}
                                                inputProps={{ readOnly: true }}
                                            />
                                        }
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card elevation={0}>
                        <CardHeader title={<Typography variant='h6'>
                            Vaccinated information
                        </Typography>}/>
                        <CardContent>
                            {
                                user && <UserVaccinated vaccinatedList={user.vaccinated}/>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default QRScan

const UserVaccinated = ({vaccinatedList}) => {
    const tableHeader = [
        {
            field: 'vaccine', headerName: 'Vaccine', width: 220,
            renderCell: (params) => params.value.name
        },
        {
            field: 'vaccineLot', headerName: 'Vaccine lot', width: 170,
            renderCell: (params) => params.value.name
        },
        {
            field: 'createdAt', headerName: 'Time',flex: 1,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        },
    ]

    return (
        <DataGrid
            autoHeight
            rows={vaccinatedList}
            columns={tableHeader}
            pageSize={6}
            rowsPerPageOptions={[6]}
            density='comfortable'
            showColumnRightBorder
            showCellRightBorder
            disableSelectionOnClick
        />
    )
}