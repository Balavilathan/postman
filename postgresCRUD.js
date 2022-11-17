const {request, response} = require("express");
const Pool = require('pg').Pool
/*
const pool = new Pool({
    'user': 'postgres',
    'host': 'localhost',
    'database': 'bala',
    'password': 'Admin@13579',
    'port':5432
})


const pool = new Pool({
    'user': 'postgres',
    'host': 'localhost',
    'database': 'balaDemo',
    'password': 'pgadmin1',
    'port':5432,
	  ssl: {
    rejectUnauthorized: false
  }
})
 */
 
 const pool = new Pool({
  database_driver:'pgsql',
  user: 'ojsosbuiqyntyr',
  host: 'ec2-44-195-132-31.compute-1.amazonaws.com',
  database: 'depo2gk84nnenc',
  password: 'c0e4c6cbf2767995b633bb9669c1ffa0de898e70e032e284378370c99a949a03',
  port: 5432,
	  ssl: {
    rejectUnauthorized: false
  }
})

const poolSF = new Pool({
    database_driver:'pgsql',
    user: 'qtibzagfzqdwrm',
    host: 'ec2-52-200-5-135.compute-1.amazonaws.com',
    database: 'd5e2te35esqbet',
    password: '9ef412d4f5500080647cedf416e412ead616c95bb8ee2b0e84cf7a84550726f0',
    port: 5432,
        ssl: {
      rejectUnauthorized: false
    }
  })

const getUsers = (request, response) => {
    pool.query('SELECT * FROM tbl_users ORDER BY id ASC', (error, results) =>{
        if(error) {
            throw error;
        }
        response.status(200).json(results.rows)
    })
}

const getUserbyId = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM tbl_users WHERE id = $1 ',
               [id],
              (error, results) =>{
                    if(error) {
                    throw error;
                    }
                response.status(200).json(results.rows)
               }
               )
}

const createUser = (request, response) => {
    const {id, firstName, lastName } = request.body
    pool.query('INSERT INTO tbl_users ("id" , "firstName" , "lastName") VALUES ($1,$2,$3) RETURNING *',[id , firstName , lastName], (error, results) => {
        if(error) {
            throw error;
        }
        response.status(201).send(`Added User: ${results.rows[0].id}`)
    })
}
/* update salesforce object */
const createUserSalesforce = (request, response) => {
    const {name,first_name, last_name } = request.body
    poolSF.query('INSERT INTO salesforce.users__c (name, firstname__c, lastname__c) VALUES ($1,$2,$3) RETURNING *',
                [name,first_name,last_name], 
                (error, results) => {
                        if(error) {
                           console.log(error)
                           throw error
                        }
                        response.status(201).send(`Added User: ${results.rows[0].name}`)
                }
            )
}

/* this method call in DELETE method  */
const delUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'DELETE FROM tbl_users WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User Deleted with ID: ${id}`)
        }
    )
}

/* -- another way using POST method with JSON --*/
const deleteUser = (request, response) => {
    const {id} = request.body
    pool.query('DELETE FROM tbl_users WHERE tbl_users.id = $1 ',
	            [id], 
			    (error, results) => {
                    if(error) {
                       throw error;
                    }
                    response.status(201).send(`Deleted User: ${id}`)
                }
				)
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { firstName, lastName } = request.body

    pool.query(
        'UPDATE tbl_users SET "firstName" = $1, "lastName" = $2 WHERE id = $3',
        [firstName, lastName, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

module.exports = {
    getUsers,
    createUser,
	deleteUser,
    updateUser,
    delUser,
    getUserbyId,
    createUserSalesforce
}