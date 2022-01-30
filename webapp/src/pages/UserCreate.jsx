import { useState } from 'react'
import { Box, Stack, Button, Grid, Card, CardContent, FormControl, TextField, Autocomplete, Typography } from '@mui/material'
import { PageHeader, CustomDialog } from '../components'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import addressList from '../assets/dvhcvn.json'
import userApi from '../api/userApi'

const UserCreate = () => {
    const navigate = useNavigate()
    const [onSubmit, setOnSubmit] = useState(false)
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [phone, setPhone] = useState()
    const [phoneError, setPhoneError] = useState(false)
    const [address, setAddress] = useState()
    const [addressError, setAddressError] = useState(false)
    const [idCard, setIdCard] = useState('')
    const [idCardError, setIdCardError] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState('')
    const [dialogText, setDialogText] = useState('')

    const createUser = async () => {
        if (onSubmit) return

        const error = [!phone, !name, !address, !idCard]
        setIdCardError(!idCard)
        setPhoneError(!phone)
        setNameError(!name)
        setAddressError(!address)

        if (!error.every(e => !e)) return

        setOnSubmit(true)
        const params = {
            phoneNumber: phone,
            fullName: name,
            idNumber: idCard,
            address: address.name
        }

        try {
            const res = await userApi.create(params)
            console.log(res)
            setOnSubmit(false)
            navigate(`/user/${res.user.id}`)
        } catch(err) {
            setOnSubmit(false)
            setDialogText(err.response.data)
            setDialogType('error')
            setDialogOpen(true)
            console.log(err.response)
        }
    } 

    return (
        <>
            <Box width='40%'>
                <PageHeader 
                    title='Create user'
                    rightContent={<Stack direction='row' spacing={2}>
                        <Button variant='text' onClick={() => navigate('/user')}>
                            Cancel
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={createUser}
                            loading={onSubmit}
                        >
                            Create
                        </LoadingButton>
                    </Stack>}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card elevation={0}>
                            <CardContent>
                                <FormControl fullWidth margin='normal'>
                                    <TextField
                                        label='Id card'
                                        variant='outlined'
                                        value={idCard}
                                        onChange={(e) => setIdCard(e.target.value)}
                                        error={idCardError}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin='normal'>
                                    <TextField
                                        label='Fullname'
                                        variant='outlined'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        error={nameError}
                                    />
                                </FormControl>
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
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
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

export default UserCreate
