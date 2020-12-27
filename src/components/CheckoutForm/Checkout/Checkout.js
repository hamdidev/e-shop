import React, {useState, useEffect} from 'react'
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core'
import {Link, useHistory} from 'react-router-dom'
import AddressForm from '../AddressForm'
import PaymanetForm from '../PaymentForm'

import useStyles from './styles'
import {commerce} from '../../../lib/commerce'


const steps = ['Shipping Address', 'Payment Details']

const Checkout = ({cart, order, onCaptureCheckout, error}) => {

    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})
    const classes = useStyles();
    const history = useHistory()
    const [ isFinished, setIsFinished]= useState(false)

    useEffect(()=>{
        const generateToken = async ()=>{
            try{
                const token = await commerce.checkout.generateToken(cart.id, {type: "cart"})
                
                setCheckoutToken(token)
            } catch(error){
                history.pushState('/')

            }
        }

        generateToken()
    },[cart])
    const nextStep = ()=> setActiveStep((preActiveStep)=> preActiveStep + 1)
    const backStep = ()=> setActiveStep((preActiveStep)=> preActiveStep - 1)

    const next = (data)=>{
        setShippingData(data)
        nextStep();
    }

    const timeout = ()=> {
        setTimeout(()=>{
            setIsFinished(true)
        },3000)
    }

    let Confirmation = ()=> order.customer ?  (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname} </Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order ref: {order.customer_reference} </Typography>

            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ) : isFinished ? (


        <>
            <div>
                <Typography variant="h5">Thank you for your purchase</Typography>
                <Divider className={classes.divider} />
                

            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    )
    
    
    
    
    
    : (
        <div className={classes.spinner}>
            <CircularProgress />

        </div>
    ); if(error){
        <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>

        </>
    }


    const Form = ()=> activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next}/>
        : <PaymanetForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />


    return (
        <>
        <CssBaseline />
            <div className={classes.toolbar} />  
            <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4" align="center">Check out</Typography>
                        <Stepper className={classes.stepper} activeStep={activeStep}>
                            {steps.map((step)=>(
                                <Step key={step}>
                                    <StepLabel>{step}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                    </Paper>

            </main>
        </>
    )
}

export default Checkout
