import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import userApi from '../api/userApi'
import addressList from '../assets/dvhcvn.json'
import { PageHeader, CustomDialog, UserVaccine } from '../components'
import QRCode from 'react-qr-code'
import { LoadingButton } from '@mui/lab'
import { Grid, Stack, Card, CardContent, CardActions, Autocomplete, FormControl, TextField, Box, Typography, Button } from '@mui/material'

const UserDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [onDelete, setOnDelete] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await userApi.getOne(id)
                setUser(res)
            } catch(err) {
                console.log(err)
            }
        }
        getUser()
    }, [])

    const onUpdateSuccess = () => {
        console.log('onUpdateSuccess')
        setDialogText('User updated!')
        setDialogType('success')
        setDialogOpen(true)
    }

    const onUpdateFalse = (message) => {
        console.log('onUpdateFalse')
        setDialogText(message || 'User update failed')
        setDialogType('error')
        setDialogOpen(true)
    }

    const deleteUser = async () => {
        if (onDelete) return
        setOnDelete(true)

        try {
            await userApi.delete(id)
            setOnDelete(false)
            navigate('/user')
        } catch(err) {
            console.log(err)
            setOnDelete(false)
            setDialogText('Delete failed!')
            setDialogType('error')
            setDialogOpen(true)
        }
    }

    return (
        <>
            <PageHeader 
                title='User detail'
                rightContent={<LoadingButton
                    variant='text'
                    disableElevation
                    color='error'
                    loading={onDelete}
                    onClick={deleteUser}
                >
                    Delete
                </LoadingButton>}
            />
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Stack spacing={4}>
                        {
                            user && <UserInfo 
                                user={user}
                                onUpdateFalse={onUpdateFalse}
                                onUpdateSuccess={onUpdateSuccess}
                            />
                        }
                        {
                            user && <UserVaccine user={user}/>
                        }
                    </Stack>
                </Grid>
                <Grid item xs={3}>
                    <Card elevation={0}>
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {
                                    user && <QRCode
                                        id='qrCode'
                                        value={user._id}
                                        size={235}
                                        level='H'
                                    />
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <CustomDialog 
                open={dialogOpen}
                type={dialogType}
                showIcon
                content={<Typography variant='subtitle1' textAlign='center'>
                    {dialogText}
                </Typography>}
                actions={<Box width='100%' sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button variant='contained' onClick={() => setDialogOpen(false)}>
                        OK
                    </Button>
                </Box>}
            />
        </>
    )
}

export default UserDetail

const UserInfo = ({user, onUpdateFalse, onUpdateSuccess}) => {
    const [onUpdate, setOnUpdate] = useState(false)
    const [name, setName] = useState(user.fullName)
    const [nameError, setNameError] = useState(false)
    const [phone, setPhone] = useState(user.phoneNumber)
    const [phoneError, setPhoneError] = useState(false)
    const [address, setAddress] = useState(addressList.data.find(e => e.name === user.address) || undefined)
    const [addressError, setAddressError] = useState(false)
    const [idCard, setIdCard] = useState(user.idNumber)
    const [idCardError, setIdCardError] = useState(false)

    const updateUser = async () => {
        if (onUpdate) return

        const error = [!phone, !name, !address, !idCard]
        setIdCardError(!idCard)
        setPhoneError(!phone)
        setNameError(!name)
        setAddressError(!address)

        if (!error.every(e => !e)) return

        setOnUpdate(true)

        const params = {
            phoneNumber: phone,
            fullName: name,
            idNumber: idCard,
            address: address.name
        }

        try {
            const res = await userApi.update(user.id, params)
            console.log(res)
            setOnUpdate(false)
            onUpdateSuccess()
        } catch(err) {
            setOnUpdate(false)
            console.log(err.response.data)
            onUpdateFalse(err.response.data)
        }
    } 

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Id card'
                                variant='outlined'
                                value={idCard}
                                onChange={(e) => setIdCard(e.target.value)}
                                error={idCardError}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Fullname'
                                variant='outlined'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={nameError}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Phone'
                                variant='outlined'
                                type='number'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                error={phoneError}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth margin='normal'>
                            <Autocomplete
                                options={addressList.data}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => <Box {...props} component='li'>
                                    {option.name}
                                </Box>}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label='Address'
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password'
                                    }}
                                    error={addressError}
                                />}
                                value={address}
                                onChange={(e, newValue) => setAddress(newValue)}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <LoadingButton
                    variant='contained'
                    disableElevation
                    onClick={updateUser}
                    loading={onUpdate}
                >
                    Update
                </LoadingButton>
            </CardActions>
        </Card>
    ) 
}
    