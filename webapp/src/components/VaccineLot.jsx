import { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Typography, Box, FormControl, TextField } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import { LoadingButton } from '@mui/lab'
import { DataGrid } from '@mui/x-data-grid'
import { CustomDialog } from '.'
import moment from 'moment'
import vaccineLotApi from '../api/vaccineLotApi'

const VaccineLot = ({vaccine, onLotAdded, onLotDeleted, onLotUpdated}) => {
    const [pageSize, setPageSize] = useState(9)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [onSubmit, setOnSubmit] = useState(false)
    const [lotNumber, setLotNumber] = useState('')
    const [lotNumberError, setLotNumberError] = useState(false)
    const [quantity, setQuantity] = useState('')
    const [quantityError, setQuantityError] = useState(false)
    const [onDelete, setOnDelete] = useState(false)
    const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const [onUpdate, setOnUpdate] = useState(false)
    const [selectedLot, setSelectedLot] = useState()

    const tableHeader = [
        {
            field: 'name', headerName: 'Lot number', width: 130
        },
        {
            field: 'quantity', headerName: 'Quantity', width: 90, align: 'right',
            renderCell: (params) => params.value.toLocaleString('de-DE')
        },
        {
            field: 'vaccinated', headerName: 'Vaccinated', width: 100, align: 'right',
            renderCell: (params) => params.value.toLocaleString('de-DE')
        },
        {
            field: 'id', headerName: 'Available', width: 90, align: 'right',
            renderCell: (params) => (params.row.quantity - params.row.vaccinated).toLocaleString('de-DE')
        },
        {
            field: 'createAt', headerName: 'Time', width: 150, align: 'right',
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            field: '_id', 
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                    <LoadingButton
                        color='error'
                        disableElevation
                        startIcon={<DeleteOutlinedIcon/>}
                        loading={onDelete}
                        onClick={() => deleteLot(params.row.id)}
                    >
                        Delete
                    </LoadingButton>
                    <Button
                        disableElevation
                        startIcon={<ModeEditOutlinedIcon/>}
                        onClick={() => selectLot(params.row)}
                    >
                        Edit
                    </Button>
                </>
            )
        }
    ]

    const createLot = async () => {
        if (onSubmit) return

        const error = [!lotNumber, !quantity]
        setLotNumberError(!lotNumber)
        setQuantityError(!quantity)

        if (!error.every(e => !e)) return
        setOnSubmit(true)

        const params = {
            vaccineId: vaccine.id,
            name: lotNumber,
            quantity
        }

        try {
            await vaccineLotApi.create(params)
            setLotNumber('')
            setQuantity('')
            setShowAddDialog(false)
            onLotAdded()
        } catch(err) {
            console.log(err)
            setOnSubmit(false)
        } 
    }

    const deleteLot = async(lotId) => {
        if (onDelete) return
        setOnDelete(true)

        try {
            await vaccineLotApi.delete(lotId)
            onLotDeleted()
        } catch(err) {
            console.log(err)
        } finally {
            setOnDelete(false)
        }
    }

    const selectLot = (lot) => {
        setLotNumber(lot.name)
        setQuantity(lot.quantity)
        setSelectedLot(lot)
        setShowUpdateDialog(true)
    }

    const hideUpdateDialog = () => {
        setLotNumber('')
        setQuantity('')
        setSelectedLot(undefined)
        setShowUpdateDialog(false)
    }

    const updateLot = async() => {
        if (onUpdate) return 

        const error = [!lotNumber, !quantity]

        setLotNumberError(!lotNumber)
        setQuantityError(!quantity)

        if (!error.every(e => !e)) return
        setOnUpdate(true)

        const params = {
            name: lotNumber,
            quantity
        }

        try {
            await vaccineLotApi.update(selectedLot.id, params)
            setLotNumber('')
            setQuantity('')
            setShowUpdateDialog(false)
            onLotUpdated()
        } catch(err) {
            console.log(err)
        } finally {
            setOnUpdate(false)
        }
    }

    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={<Typography variant='h6'>
                        Lots information
                    </Typography>}
                    action={<Button
                        variant='contained'
                        disableElevation
                        onClick={() => setShowAddDialog(true)}
                    >
                        Add lot
                    </Button>}
                />
                <CardContent>
                    <DataGrid
                        autoHeight
                        rows={vaccine.vaccineLots}
                        columns={tableHeader}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 50]}
                        onPageSizeChange={(size) => setPageSize(size)}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                        disableSelectionOnClick
                    />
                </CardContent>
            </Card>
            <CustomDialog
                open={showAddDialog}
                title='Add vaccine lot'
                content={<Box sx={{width: '400px'}}>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='Lot number'
                            variant='outlined'
                            value={lotNumber}
                            onChange={(e) => setLotNumber(e.target.value)}
                            error={lotNumberError}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='Quantity'
                            variant='outlined'
                            type='number'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            error={quantityError}
                        />
                    </FormControl>
                </Box>}
                actions={<Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }} width='100%'>    
                    <Button
                        variant='text'
                        onClick={() => setShowAddDialog(false)}
                        // disable={onSubmit}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant='contained'
                        disableElevation
                        loading={onSubmit}
                        onClick={createLot}
                    >
                        Save
                    </LoadingButton>
                </Box>}
            />
            <CustomDialog
                open={showUpdateDialog}
                title='Update vaccine lot'
                content={<Box sx={{width: '400px'}}>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='Lot number'
                            variant='outlined'
                            value={lotNumber}
                            onChange={(e) => setLotNumber(e.target.value)}
                            error={lotNumberError}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='Quantity'
                            variant='outlined'
                            type='number'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            error={quantityError}
                        />
                    </FormControl>
                </Box>}
                actions={<Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }} width='100%'>    
                    <Button
                        variant='text'
                        onClick={hideUpdateDialog}
                        // disable={onUpdate}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant='contained'
                        disableElevation
                        loading={onUpdate}
                        onClick={updateLot}
                    >
                        Save
                    </LoadingButton>
                </Box>}
            />
        </>
    )
}

export default VaccineLot
