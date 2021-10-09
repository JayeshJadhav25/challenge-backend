
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

app.get('/barchart/:month',(req,res) => {
    try {
        var month = req.params.month;
        connection.query(`SELECT '0 TO 10' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 0 AND 100 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '101 TO 200' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 101 AND 200 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '201 TO 300' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 201 AND 300 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '301 TO 400' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 301 AND 400 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '401 TO 500' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 401 AND 500 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '501 TO 600' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 501 AND 600 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '601 TO 700' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 601 AND 700 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '701 TO 800' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 701 AND 800 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '801 TO 900' as pricerange, COUNT(id) FROM sales WHERE price BETWEEN 801 AND 900 AND dateofsale LIKE '%-${month}-%'
        UNION
        SELECT '900 Above' as pricerange, COUNT(id) FROM sales WHERE price > 901 AND dateofsale LIKE '%-${month}-%'`,(error,result) => {
            if(error) {
                res.status(500).json(error)
            }else {
                res.json(result)
            }
        })
    } catch(error) {
        res.status(500).json(error)
    }
})

app.listen(port,() => {
    console.log(`server is running at port ${port}...`)
})