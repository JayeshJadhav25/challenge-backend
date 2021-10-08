
const express = require('express')
const axios = require('axios')
const connection = require('./database/db')

connection.connect(function(err) {
    if(err) {
        console.log(err)
    } else {
        console.log('database is connected..')
    }
})

const app = express()
const port = 3000;

app.get('/fetchdata',async (req,res) => {
    try {
        const fetcdata = await axios.get('https://roxiler-interviews.s3.amazonaws.com/product_transaction.json')
        
        var allData = fetcdata.data
        
        allData.forEach(element => {

            id = element.id
            title = element.title
            price = element.price
            description = element.description
            category = element.category
            image = element.image
            sold = element.sold
            
            dateofsale = new Date(element.dateOfSale)

            connection.query('insert into sales(id,title,price,description,category,image,sold,dateofsale) values(?,?,?,?,?,?,?,?)',[id,title,price,description,category,image,sold,dateofsale],(error,iresult) => {
                if(error) {
                   console.log(error)
                } 
            })



        })

        res.json('data inserted ')
        
       
    } catch(err) {
        res.json(err)
    }
})


app.get('/saleamount/:month',(req,res) => {
    var month = req.params.month;
    try {

    connection.query(`SELECT SUM(price)  saleamount  FROM sales WHERE sold=1 AND dateofsale LIKE '%-${month}-%'`,[month],(error,result) => {
        if(error) {
            res.status(500).json(error)
        } else {
            res.json(result)
        }
    })
    }
    catch(err) {
        res.status(500).json(err)
    }
})  


app.get('/solditem/:month',(req,res) => {
    var month = req.params.month;

    try {
        connection.query(`SELECT COUNT(*)  totalsolditem  FROM sales WHERE sold=1 AND dateofsale LIKE '%-${month}-%'`,[month],(error,result) => {
            if(error) {
                res.status(500).json(error)
            } else {
                res.json(result)
            }
        })
    } catch(err) {
        res.status(500).json(err)
    }    
}) 

app.get('/notsolditem/:month',(req,res) => {
    var month = req.params.month;

    try {
        connection.query(`SELECT COUNT(*)  totalnotsolditem  FROM sales WHERE sold=0 AND dateofsale LIKE '%-${month}-%'`,[month],(error,result) => {
            if(error) {
                res.status(500).json(error)
            } else {
                res.json(result)
            }
        })
    } catch(err) {

    }
    
}) 


app.get('/uniquecategories/:month',(req,res) => {
    var month = req.params.month;
    try {
        connection.query(`SELECT category,COUNT(*) items FROM sales WHERE dateofsale LIKE '%-${month}-%'  GROUP BY category`,(error,result) => {
            if(error) {
                res.status(500).json(result)
            } else {
                res.json(result)
            }
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

app.listen(port,() => {
    console.log(`server is running at port ${port}...`)
})