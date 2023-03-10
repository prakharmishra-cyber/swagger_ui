import express from  'express';
import {nanoid} from 'nanoid';
const router = express.Router();

const idLength = 0;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns teh list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'       
 */

router.get('/', async(req, res)=>{
    await req.app.db.read();
    const books = req.app.db.data;
    res.send(books);
})

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */

router.get("/:id", async(req, res)=>{
    await req.app.db.read();
    const books =  req.app.db.data.books;
    const temp = books.filter((element)=>element.id===req.params.id);
    res.send(temp);
})

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post('/', async(req, res)=>{
    try {
        const book = {
            id: nanoid(idLength),
            ...req.body
        }
        await req.app.db.read();
        const temp = [...req.app.db.data.books, book];
        req.app.db.data.books = temp;
        await req.app.db.write();
        res.send(book)
    }catch(error) {
        return res.status(500).send(error);
    }
})

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", async(req, res)=>{
    try{
        await req.app.db.read();
        var temp = req.app.db.data.books;
        var temp2 = temp.filter((element)=>element.id!==req.params.id);
        temp2 = [...temp2, req.body];
        req.app.db.data.books = temp2;
        console.log(temp2);
        await req.app.db.write();
        res.send(req.body);     
    }catch(error) {
        return res.status(500)
        .send(error);
    }
})

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 * 
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

router.delete("/:id", async(req, res)=>{
    await req.app.db.read();
    var temp = req.app.db.data.books;
    var temp2 = temp.filter((element)=>element.id!==req.params.id);
    req.app.db.data.books = temp2;
    await req.app.db.write();
    res.sendStatus(200);
})

export default router;



