import React, {useState, useEffect} from 'react'
import {Typography, InputLabel, Select, MenuItem, Button,Grid, }from '@material-ui/core'
import {useForm, FormProvider} from 'react-hook-form'
import {Link} from 'react-router-dom'
import CustomFormField from './CustomTextField'


import {commerce} from '../../lib/commerce'

const AddressForm = ({checkoutToken, next}) => {
    const [shippingCountries, setShippingCountries] = useState([])
    const [shippingCountry, setShippingCountry] = useState('')
    const [shippingSubDs, setShippingSubDs] = useState([])
    const [shippingSubD, setShippingSubD] = useState('')
    const [shippingOptions, setShippingOptions] = useState([])
    const [shippingOption, setShippingOption] = useState('')

    const methods = useForm();
    
    const countries =  Object.entries(shippingCountries).map(([code,name]) => ({id: code, label: name}))
    const subdivisions =  Object.entries(shippingSubDs).map(([code,name]) => ({id: code, label: name}))
    const options = shippingOptions.map((sO)=>({id: sO.id, label:`${sO.description} - (${sO.price.formatted_with_symbol})`}))
    


    const fetchShippingCountries = async(checkoutTokenId)=>{
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId)

        
        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    } 

    const fetchSubDs = async (countryCode)=>{
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode)

        setShippingSubDs(subdivisions);
        setShippingSubD(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region= null)=>{
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region})

        setShippingOptions(options);
        setShippingOption(options[0].id);


    }

    useEffect(()=>{
        fetchShippingCountries(checkoutToken.id)
    },[])
    useEffect(()=>{
        if(shippingCountry) fetchSubDs(shippingCountry)

    },[shippingCountry])


    useEffect(()=>{
        if(shippingSubD) fetchShippingOptions(checkoutToken.id, shippingSubD, shippingCountry)
    },[shippingSubD])


    return (
        <>
           <Typography variant="h6" gutterBottom >Shipping Address</Typography>
           <FormProvider {...methods}> 
                <form onSubmit={methods.handleSubmit((data)=> next({ ...data, shippingCountry,shippingSubD, shippingOption}))}>
                    <Grid container spacing={3}>
                        <CustomFormField   name="firstName" label="First Name"/>
                        <CustomFormField   name="lastName" label="Last Name"/>
                        <CustomFormField   name="address1" label="Address"/>
                        <CustomFormField   name="email" label="Email"/>
                        <CustomFormField   name="city" label="City"/>
                        <CustomFormField   name="zip" label="ZIP / Postal Code"/>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e)=> setShippingCountry(e.target.value)}>
                                {countries.map((country)=> (

                                <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                        
                                </MenuItem>
                                ))}

                            </Select>

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubD} fullWidth onChange={(e)=> setShippingSubD(e.target.value)}>
                            {subdivisions.map((subdivision)=> (

                                <MenuItem
                                 key={subdivision.id}
                                 value={subdivision.id}>
                                 {subdivision.label}

                                </MenuItem>
                            ))}

                            </Select>

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e)=> setShippingOption(e.target.value)}>
                                {options.map((option)=> (

                                    <MenuItem
                                    key={option.id}
                                    value={option.id}>
                                    {option.label}

                                    </MenuItem>
                                ))}

                            </Select>

                        </Grid>
                    </Grid>
                    <br />

                    <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <Button component={Link} to='/cart' variant="outlined">Back to cart</Button>
                                    <Button type='submit' variant="contained" color='primary'>Next</Button>
                    </div>


                </form>

           </FormProvider>
        </>
    )
}

export default AddressForm
