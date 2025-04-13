// api/index.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('users').select('*')
    if (error) return res.status(500).json({ error })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { uid, user, password, AuthorizedAdmin, AllowServiceEditing, AllowUsersEditing } = req.body

    const { data, error } = await supabase.from('users').insert([
      {
        uid,
        user,
        password,
        AuthorizedAdmin,
        AllowServiceEditing,
        AllowUsersEditing
      }
    ])

    if (error) return res.status(500).json({ error })
    return res.status(201).json({ message: 'Added successfully', data })
  }

  if (req.method === 'DELETE') {
    const { uid } = req.body

    const { error } = await supabase.from('users').delete().eq('uid', uid)
    if (error) return res.status(500).json({ error })
    return res.status(200).json({ message: `Deleted uid ${uid} successfully` })
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}
