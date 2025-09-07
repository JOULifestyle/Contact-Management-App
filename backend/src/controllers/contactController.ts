import { Request, Response, NextFunction } from 'express'
import prisma from '../db'


export async function listContacts(req: Request, res: Response, next: NextFunction) {
try {
const contacts = await prisma.contact.findMany({ orderBy: { id: 'desc' } })
res.json(contacts)
} catch (err) { next(err) }
}


export async function getContact(req: Request, res: Response, next: NextFunction) {
try {
const id = Number(req.params.id)
const contact = await prisma.contact.findUnique({ where: { id } })
if (!contact) return res.status(404).json({ message: 'Not found' })
res.json(contact)
} catch (err) { next(err) }
}


export async function createContact(req: Request, res: Response, next: NextFunction) {
try {
const { name, email, phone, category, birthday, company, userId } = req.body
const created = await prisma.contact.create({
  data: {
	name,
	email,
	phone,
	category,
	birthday,
	company,
	user: { connect: { id: userId } }
  }
})
res.status(201).json(created)
} catch (err: any) {
if (err.code === 'P2002') { // unique constraint
return res.status(400).json({ message: 'Email already exists' })
}
next(err)
}
}


export async function updateContact(req: Request, res: Response, next: NextFunction) {
try {
const id = Number(req.params.id)
const { name, email, phone, category, birthday, company } = req.body
const updated = await prisma.contact.update({ where: { id }, data: { name, email, phone, category, birthday, company } })
res.json(updated)
} catch (err: any) {
if (err.code === 'P2025') return res.status(404).json({ message: 'Contact not found' })
if (err.code === 'P2002') return res.status(400).json({ message: 'Email already exists' })
next(err)
}
}


export async function deleteContact(req: Request, res: Response, next: NextFunction) {
try {
const id = Number(req.params.id)
await prisma.contact.delete({ where: { id } })
res.status(204).send()
} catch (err: any) {
if (err.code === 'P2025') return res.status(404).json({ message: 'Contact not found' })
next(err)
}
}