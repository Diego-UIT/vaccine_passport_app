import { useState, useEffect } from 'react'
import vaccineApi from '../api/vaccineApi'
import { Button, Paper, FormControl, TextField, Box } from '@mui/material'
import { PageHeader, CustomDialog } from '../components'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { LoadingButton } from '@mui/lab'

const Vaccine = () => {
    const [vaccineList, setVaccineList] = useState([])
    const [pageSize, setPageSize] = useState(9)
    const [showCreateModal, setShowCreateModal] = useState(false)

    useEffect(() => {
        const getVaccines = async () => {
            try {
                const response = await vaccineApi.getAll()
                setVaccineList(response)
            } catch(err) {
                console.log(err)
            }
        }
        getVaccines()
    }, [])

    const tableHeader = [
        {
            field: 'name', headerName: 'Name', flex: 1,
            renderCell: (params) => <Button
                variant='text'
                component={Link}
                to={`/vaccine/${params.row.id}`}
            >
                {params.value}
            </Button>
        },
        {
            field: 'quantity', headerName: 'Quantity', align: 'right', width: 170,
            renderCell: (params) => params.value.toLocaleString('de-DE')
        },
        {
            field: 'vaccinated', headerName: 'Vaccinated', align: 'right', width: 170,
            renderCell: (params) => params.value.toLocaleString('de-DE')
        },
        {
            field: 'id', headerName: 'Available', align: 'right', width: 170,
            renderCell: (params) => (params.row.quantity - params.row.vaccinated).toLocaleString('de-DE')
        },
        {
            field: 'vaccineLots', headerName: 'Lots', align: 'right', width: 170,
            renderCell: (params) => params.value.length
        },
        {
            field: 'createdAt', headerName: 'Create at', width: 170,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        },
    ]

    const onCreateSuccess = (newVaccine) => {
        setVaccineList([newVaccine, ...vaccineList])
        setShowCreateModal(false)
    }

    return (
        <>
            <PageHeader
                title='Vaccine list'
                rightContent={<Button
                    variant='contained'
                    disableElevation
                    onClick={() => setShowCreateModal(true)}
                >
                    Create
                </Button>}
            />
            <Paper elevation={0}>
                <DataGrid
                    autoHeight
                    rows={vaccineList}
                    columns={tableHeader}
                    pageSize={pageSize}
                    rowsPerPageOptions={[9, 50, 100]}
                    onPageSizeChange={(size) => setPageSize(size)}
                    density='comfortable'
                    showColumnRightBorder
                    showCellRightBorder
                    disableSelectionOnClick
                />
            </Paper>
            <VaccineCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={onCreateSuccess}
            />
        </>
    )
}

export default Vaccine

const VaccineCreateModal = ({show, onClose, onSuccess}) => {

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [onSubmit, setOnSubmit] = useState(false)
    
    const createVaccine = async () => {
        if (onSubmit) return

        if (!name || name.trim().length === 0) {
            setNameError(true)
            return
        }
    
        setNameError(false)
        setOnSubmit(true)

        try {
            const response = await vaccineApi.create({name})
            setName('')
            onSuccess(response)
        } catch(err) {
            console.log(err)
        } finally {
            setOnSubmit(false)
        }
    }
    
    return (
        <CustomDialog
            open={show}
            title='Add vaccine'
            content={<Box padding='4px 0'>
                <FormControl>
                    <TextField
                        label='Vaccine name'
                        variant='outlined'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={nameError}
                    />
                </FormControl>
            </Box>}
            actions={<Box width='100%' sx={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <Button
                    variant='text'
                    onClick={() => onClose()}
                >
                    Cancel
                </Button>
                <LoadingButton
                    variant='contained'
                    onClick={createVaccine}
                >
                    Create
                </LoadingButton>
            </Box>}
        />
    )
}