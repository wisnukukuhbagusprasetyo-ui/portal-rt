import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  ClipboardList,
  BookOpen,
  Calendar,
  Newspaper,
  FileText,
  Image as ImageIcon,
  Settings,
  Mail,
  Phone,
  MapPin,
  Building2,
  Download,
  Plus,
  Pencil,
  Trash2,
  BadgeInfo,
  CheckCircle,
  AlertTriangle,
  Receipt,
  Wallet,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// --- Utility ---
const Section = ({ icon: Icon, title, subtitle, children }) => (
  <section className="w-full">
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-2xl bg-gray-100 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-xl font-semibold leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const Empty = ({ icon: Icon, title, action }) => (
  <div className="flex flex-col items-center justify-center text-center p-10 rounded-3xl border border-dashed">
    <Icon className="w-8 h-8 mb-2" />
    <p className="font-medium mb-2">{title}</p>
    {action}
  </div>
);

// --- Mock seed data (edit freely) ---
const seedNews = [
  { id: 1, title: "Kerja Bakti Minggu Pagi", date: "2025-10-05", body: "Warga diharapkan membawa sapu & alat kebersihan. Kumpul di pos ronda 07.00." },
  { id: 2, title: "Pembagian Sembako", date: "2025-10-12", body: "Kuota 50 paket untuk warga prioritas. Hubungi pengurus untuk pendaftaran." },
];

const seedEvents = [
  { id: 1, name: "Rapat Bulanan RT", date: "2025-10-06", time: "19:30", place: "Balai RW", notes: "Bahas iuran & ronda." },
  { id: 2, name: "Senam Pagi", date: "2025-10-13", time: "06:00", place: "Lapangan", notes: "Gratis & terbuka." },
];

const seedResidents = [
  { id: 1, name: "Bapak Andi", kk: "3374-01-001", address: "Jl. Melati No. 1", phone: "0812-1111-1111", status: "Tetap" },
  { id: 2, name: "Ibu Sari", kk: "3374-01-002", address: "Jl. Melati No. 2", phone: "0813-2222-2222", status: "Kontrak" },
];

const seedComplaints = [
  { id: 1, citizen: "Rudi", type: "Kebersihan", message: "Sampah menumpuk di pojok gang.", date: "2025-09-28", status: "proses" },
];

const seedCash = [
  { id: 1, date: "2025-09-15", desc: "Iuran Warga", type: "+", amount: 500000 },
  { id: 2, date: "2025-09-18", desc: "Beli Sapu", type: "-", amount: 85000 },
];

// --- Small helpers ---
function currency(idr) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(idr);
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// --- Components ---
function Letterhead({ profile }) {
  const [body, setBody] = useState("Dengan hormat,\n\nSehubungan dengan ... (isi surat Anda)\n\nHormat kami,\nPengurus RT");
  const template = useMemo(() => `RT ${profile.rt}/RW ${profile.rw} ${profile.village}, ${profile.subdistrict}, ${profile.city}\nAlamat: ${profile.address}\nKontak: ${profile.phone} | ${profile.email}\n\n———————————————\nNomor: ______ / RT-${profile.rt} / ${new Date().getFullYear()}\nPerihal: ______\nLampiran: ______\n\nKepada Yth,\n${profile.receiver || "____________________"}\nDi Tempat\n\n${body}\n\n${profile.city}, ${new Date().toLocaleDateString("id-ID")}\nKetua RT ${profile.rt}\n\n(${profile.chairman})`, [profile, body]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Generator Kop Surat</CardTitle>
        <CardDescription>Otomatis membuat kepala surat RT siap unduh (.txt)</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Isi Surat</Label>
          <Textarea rows={14} value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={() => downloadText(`Surat_RT${profile.rt}_${Date.now()}.txt`, template)} className="w-full"><Download className="w-4 h-4 mr-2"/>Unduh Surat</Button>
        </div>
        <div className="rounded-2xl p-4 border bg-white overflow-auto max-h-[460px]">
          <pre className="text-sm leading-6 whitespace-pre-wrap">{template}</pre>
        </div>
      </CardContent>
    </Card>
  );
}

function Cashbook() {
  const [rows, setRows] = useState(seedCash);
  const total = rows.reduce((acc, r) => acc + (r.type === "+" ? r.amount : -r.amount), 0);
  const [form, setForm] = useState({ date: "", desc: "", type: "+", amount: 0 });

  function add() {
    if (!form.date || !form.desc || !form.amount) return;
    setRows((r) => [...r, { id: Date.now(), ...form, amount: Number(form.amount) }]);
    setForm({ date: "", desc: "", type: "+", amount: 0 });
  }
  function remove(id) { setRows((r) => r.filter((x) => x.id !== id)); }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Kas RT</CardTitle>
        <CardDescription>Pencatatan pemasukan & pengeluaran sederhana</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label>Tanggal</Label>
            <Input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})}/>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>Uraian</Label>
            <Input placeholder="Mis. Iuran Warga" value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <Label>Jenis</Label>
            <div className="flex items-center gap-3">
              <Badge variant={form.type === "+" ? "default" : "secondary"} className="px-3">{form.type === "+" ? "Pemasukan" : "Pengeluaran"}</Badge>
              <Switch checked={form.type === "+"} onCheckedChange={(v)=>setForm({...form, type: v?"+":"-"})}/>
            </div>
          </div>
          <div className="space-y-1 md:col-span-3">
            <Label>Jumlah</Label>
            <Input type="number" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})}/>
          </div>
          <div className="md:col-span-1 flex items-end"><Button className="w-full" onClick={add}><Plus className="w-4 h-4 mr-2"/>Tambah</Button></div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Uraian</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r)=> (
              <TableRow key={r.id}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.desc}</TableCell>
                <TableCell>{r.type === "+" ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4"/>Masuk</span> : <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4"/>Keluar</span>}</TableCell>
                <TableCell className="text-right">{currency(r.amount)}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={()=>remove(r.id)}><Trash2 className="w-4 h-4"/></Button></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">Saldo</TableCell>
              <TableCell className="text-right font-semibold">{currency(total)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Residents() {
  const [rows, setRows] = useState(seedResidents);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const filtered = rows.filter(r => [r.name, r.kk, r.address, r.phone, r.status].join(" ").toLowerCase().includes(q.toLowerCase()));

  function upsert(data) {
    if (editing) setRows(rs => rs.map(r => r.id === editing.id ? {...editing, ...data} : r));
    else setRows(rs => [...rs, { id: Date.now(), ...data }]);
    setEditing(null);
  }
  function remove(id) { setRows(rs => rs.filter(r => r.id !== id)); }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <CardTitle>Data Warga</CardTitle>
          <CardDescription>Tambah, ubah, cari & ekspor sederhana</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2.5"/>
            <Input className="pl-8 w-64" placeholder="Cari warga / KK / alamat" value={q} onChange={(e)=>setQ(e.target.value)} />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2"/>Warga Baru</Button>
            </DialogTrigger>
            <ResidentForm onSubmit={upsert} />
          </Dialog>
          <Button variant="secondary" onClick={()=>{
            const csv = ["Nama,KK,Alamat,Telp,Status", ...rows.map(r=>`${r.name},${r.kk},${r.address},${r.phone},${r.status}")].join("\n");
            downloadText(`data_warga_${Date.now()}.csv`, csv);
          }}><Download className="w-4 h-4 mr-2"/>Ekspor CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>No. KK</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Telp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.kk}</TableCell>
                <TableCell>{r.address}</TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell><Badge variant={r.status === "Tetap" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={()=>setEditing(r)}><Pencil className="w-4 h-4"/></Button>
                    </DialogTrigger>
                    {editing && editing.id === r.id && (
                      <ResidentForm initial={editing} onSubmit={upsert} />
                    )}
                  </Dialog>
                  <Button size="icon" variant="ghost" onClick={()=>remove(r.id)}><Trash2 className="w-4 h-4"/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ResidentForm({ initial, onSubmit }) {
  const [f, setF] = useState(initial || { name: "", kk: "", address: "", phone: "", status: "Tetap" });
  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>{initial ? "Ubah Warga" : "Tambah Warga"}</DialogTitle>
        <DialogDescription>Isi data sesuai Kartu Keluarga.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div className="grid gap-1">
          <Label>Nama</Label>
          <Input value={f.name} onChange={(e)=>setF({...f, name: e.target.value})}/>
        </div>
        <div className="grid gap-1">
          <Label>No. KK</Label>
          <Input value={f.kk} onChange={(e)=>setF({...f, kk: e.target.value})}/>
        </div>
        <div className="grid gap-1">
          <Label>Alamat</Label>
          <Input value={f.address} onChange={(e)=>setF({...f, address: e.target.value})}/>
        </div>
        <div className="grid gap-1 md:grid-cols-2">
          <div className="grid gap-1">
            <Label>Telp</Label>
            <Input value={f.phone} onChange={(e)=>setF({...f, phone: e.target.value})}/>
          </div>
          <div className="grid gap-1">
            <Label>Status</Label>
            <select className="border rounded-md h-10 px-3" value={f.status} onChange={(e)=>setF({...f, status: e.target.value})}>
              <option>Tetap</option>
              <option>Kontrak</option>
              <option>Kos</option>
            </select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={()=>onSubmit(f)}>{initial ? "Simpan" : "Tambahkan"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function Complaints() {
  const [rows, setRows] = useState(seedComplaints);
  const [form, setForm] = useState({ citizen: "", type: "Kebersihan", message: ""});
  function add() {
    if (!form.citizen || !form.message) return;
    setRows(r=>[{ id: Date.now(), date: new Date().toISOString().slice(0,10), status: "baru", ...form }, ...r]);
    setForm({ citizen: "", type: "Kebersihan", message: ""});
  }
  function setStatus(id, status) { setRows(r => r.map(x => x.id === id ? { ...x, status } : x)); }
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Pengaduan Warga</CardTitle>
        <CardDescription>Saluran laporan cepat dari warga</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="grid gap-1">
            <Label>Nama Pelapor</Label>
            <Input value={form.citizen} onChange={e=>setForm({...form, citizen: e.target.value})}/>
          </div>
          <div className="grid gap-1">
            <Label>Kategori</Label>
            <select className="border rounded-md h-10 px-3" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
              <option>Kebersihan</option>
              <option>Keamanan</option>
              <option>Administrasi</option>
              <option>Fasilitas Umum</option>
            </select>
          </div>
          <div className="md:col-span-2 grid gap-1">
            <Label>Pesan</Label>
            <Input value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Tulis laporan singkat"/>
          </div>
          <div className="md:col-span-4"><Button onClick={add} className="w-full"><Plus className="w-4 h-4 mr-2"/>Kirim Laporan</Button></div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelapor</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Pesan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.citizen}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.message}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.status === "selesai" ? "default" : r.status === "proses" ? "secondary" : "outline"}>{r.status}</Badge>
                    {r.status !== "selesai" && (
                      <Button size="sm" variant="ghost" onClick={()=>setStatus(r.id, "proses")}><Pencil className="w-4 h-4 mr-1"/>Proses</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={()=>setStatus(r.id, "selesai")}><CheckCircle className="w-4 h-4 mr-1"/>Selesai</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EventsAndNews() {
  const [news, setNews] = useState(seedNews);
  const [events, setEvents] = useState(seedEvents);
  const [formN, setFormN] = useState({ title: "", date: "", body: "" });
  const [formE, setFormE] = useState({ name: "", date: "", time: "", place: "", notes: "" });
  function addNews(){ if(!formN.title) return; setNews(n=>[{ id: Date.now(), ...formN}, ...n]); setFormN({ title: "", date: "", body: "" }); }
  function addEvent(){ if(!formE.name) return; setEvents(e=>[{ id: Date.now(), ...formE}, ...e]); setFormE({ name: "", date: "", time: "", place: "", notes: "" }); }
  function remove(setter, id){ setter(prev => prev.filter(x=>x.id!==id)); }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Berita RT</CardTitle>
          <CardDescription>Informasi singkat untuk warga</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-5 gap-3">
            <div className="md:col-span-2 grid gap-1">
              <Label>Judul</Label>
              <Input value={formN.title} onChange={e=>setFormN({...formN, title: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label>Tanggal</Label>
              <Input type="date" value={formN.date} onChange={e=>setFormN({...formN, date: e.target.value})} />
            </div>
            <div className="md:col-span-2 grid gap-1">
              <Label>Isi Singkat</Label>
              <Input value={formN.body} onChange={e=>setFormN({...formN, body: e.target.value})} />
            </div>
            <div className="md:col-span-5"><Button onClick={addNews} className="w-full"><Plus className="w-4 h-4 mr-2"/>Publikasikan</Button></div>
          </div>
          <div className="grid gap-3">
            {news.map(n=> (
              <Card key={n.id} className="border rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{n.title}</CardTitle>
                  <CardDescription>{n.date || "(tanpa tanggal)"}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2"><p className="text-sm text-gray-700">{n.body}</p></CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" onClick={()=>remove(setNews, n.id)}><Trash2 className="w-4 h-4 mr-1"/>Hapus</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Agenda / Kegiatan</CardTitle>
          <CardDescription>Jadwal kegiatan lingkungan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-6 gap-3">
            <div className="md:col-span-2 grid gap-1">
              <Label>Nama Kegiatan</Label>
              <Input value={formE.name} onChange={e=>setFormE({...formE, name: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label>Tanggal</Label>
              <Input type="date" value={formE.date} onChange={e=>setFormE({...formE, date: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label>Waktu</Label>
              <Input placeholder="19:30" value={formE.time} onChange={e=>setFormE({...formE, time: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label>Lokasi</Label>
              <Input value={formE.place} onChange={e=>setFormE({...formE, place: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label>Catatan</Label>
              <Input value={formE.notes} onChange={e=>setFormE({...formE, notes: e.target.value})} />
            </div>
            <div className="md:col-span-6"><Button onClick={addEvent} className="w-full"><Plus className="w-4 h-4 mr-2"/>Tambahkan</Button></div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(e => (
                <TableRow key={e.id}>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.time}</TableCell>
                  <TableCell>{e.place}</TableCell>
                  <TableCell>{e.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={()=>setEvents(ev=>ev.filter(x=>x.id!==e.id))}><Trash2 className="w-4 h-4"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PublicHomepage({ profile }) {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Portal Warga RT {profile.rt}/RW {profile.rw} {profile.village}</h1>
          <p className="text-gray-600 mb-4">Informasi, administrasi, dan layanan warga serba cepat. Dibangun untuk lingkungan {profile.village}, {profile.subdistrict}, {profile.city}.</p>
          <div className="flex gap-2">
            <a href="#services"><Button><ClipboardList className="w-4 h-4 mr-2"/>Layanan</Button></a>
            <a href="#contact"><Button variant="secondary"><Phone className="w-4 h-4 mr-2"/>Kontak</Button></a>
          </div>
        </div>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Newspaper className="w-5 h-5"/>Terkini</CardTitle>
            <CardDescription>Berita & agenda singkat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {seedNews.slice(0,2).map(n => (
                <div key={n.id} className="p-3 rounded-xl border">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.date}</p>
                  <p className="text-sm mt-1 text-gray-700">{n.body}</p>
                </div>
              ))}
              {seedEvents.slice(0,2).map(e => (
                <div key={e.id} className="p-3 rounded-xl border">
                  <p className="text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.date} • {e.time} • {e.place}</p>
                  <p className="text-sm mt-1 text-gray-700">{e.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div id="services" className="grid md:grid-cols-3 gap-5">
        <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/>Surat Online</CardTitle><CardDescription>Buat surat pengantar & domisili</CardDescription></CardHeader><CardContent><p className="text-sm text-gray-700">Isi formulir dan unduh kop surat otomatis.</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5"/>Agenda Warga</CardTitle><CardDescription>Jadwal kegiatan & ronda</CardDescription></CardHeader><CardContent><p className="text-sm text-gray-700">Pantau kegiatan lingkungan tiap minggu.</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5"/>Iuran & Kas</CardTitle><CardDescription>Transparansi kas RT</CardDescription></CardHeader><CardContent><p className="text-sm text-gray-700">Lihat pemasukan, pengeluaran & saldo.</p></CardContent></Card>
      </div>

      <Card id="contact" className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5"/>Kontak Pengurus</CardTitle>
          <CardDescription>Hubungi kami untuk administrasi & layanan</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4"/>{profile.phone}</div>
          <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4"/>{profile.email}</div>
          <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4"/>{profile.address}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RTPortal() {
  const [active, setActive] = useState("beranda");
  const [profile, setProfile] = useState({
    rt: "01",
    rw: "08",
    village: "Kemijen",
    subdistrict: "Semarang Timur",
    city: "Semarang",
    address: "Pos Ronda RT 01/RW 08, Cilosari Barat",
    phone: "0813-2345-6938",
    email: "wisnukukuhbp@gmail.com",
    chairman: "Nama Ketua RT",
    receiver: "Bapak/Ibu ______",
  });

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-slate-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-black text-white font-bold">RT</span>
            <div>
              <p className="text-sm font-semibold leading-tight">Portal RT {profile.rt}/RW {profile.rw}</p>
              <p className="text-xs text-gray-500">{profile.village}, {profile.city}</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <NavButton icon={Home} label="Beranda" active={active} setActive={setActive} id="beranda"/>
            <NavButton icon={Users} label="Data Warga" active={active} setActive={setActive} id="warga"/>
            <NavButton icon={Newspaper} label="Berita & Agenda" active={active} setActive={setActive} id="berita"/>
            <NavButton icon={ClipboardList} label="Pengaduan" active={active} setActive={setActive} id="pengaduan"/>
            <NavButton icon={Receipt} label="Kas RT" active={active} setActive={setActive} id="kas"/>
            <NavButton icon={FileText} label="Kop Surat" active={active} setActive={setActive} id="surat"/>
            <NavButton icon={Settings} label="Pengaturan" active={active} setActive={setActive} id="set"/>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {active === "beranda" && (
          <PublicHomepage profile={profile} />
        )}
        {active === "warga" && (
          <Section icon={Users} title="Manajemen Data Warga" subtitle="CRUD sederhana + ekspor CSV">
            <Residents />
          </Section>
        )}
        {active === "berita" && (
          <Section icon={Newspaper} title="Berita & Agenda" subtitle="Kelola informasi untuk warga">
            <EventsAndNews />
          </Section>
        )}
        {active === "pengaduan" && (
          <Section icon={ClipboardList} title="Pengaduan Warga" subtitle="Laporan dari warga & penanganannya">
            <Complaints />
          </Section>
        )}
        {active === "kas" && (
          <Section icon={Receipt} title="Transparansi Kas RT" subtitle="Catat pemasukan & pengeluaran">
            <Cashbook />
          </Section>
        )}
        {active === "surat" && (
          <Section icon={FileText} title="Administrasi Surat" subtitle="Generator kop surat otomatis">
            <Letterhead profile={profile} />
          </Section>
        )}
        {active === "set" && (
          <Section icon={Settings} title="Pengaturan Portal" subtitle="Profil lingkungan & preferensi tampilan">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Profil RT</CardTitle>
                <CardDescription>Data ini akan tampil di publik & kop surat</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-3">
                {[
                  ["RT", "rt"], ["RW", "rw"], ["Kelurahan/Desa", "village"], ["Kecamatan", "subdistrict"], ["Kota/Kab", "city"], ["Alamat", "address"], ["No. HP", "phone"], ["Email", "email"], ["Nama Ketua RT", "chairman"], ["Penerima Surat Default", "receiver"],
                ].map(([label, key]) => (
                  <div key={key} className="grid gap-1">
                    <Label>{label}</Label>
                    <Input value={profile[key]} onChange={(e)=>setProfile({...profile, [key]: e.target.value})}/>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Portal RT {profile.rt}/RW {profile.rw}</p>
            <p className="text-gray-600">{profile.village}, {profile.subdistrict}, {profile.city}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Navigasi</p>
            <ul className="space-y-1 text-gray-600">
              <li><a className="hover:underline" onClick={()=>setActive("beranda")}>Beranda</a></li>
              <li><a className="hover:underline" onClick={()=>setActive("warga")}>Data Warga</a></li>
              <li><a className="hover:underline" onClick={()=>setActive("berita")}>Berita & Agenda</a></li>
              <li><a className="hover:underline" onClick={()=>setActive("pengaduan")}>Pengaduan</a></li>
              <li><a className="hover:underline" onClick={()=>setActive("kas")}>Kas RT</a></li>
              <li><a className="hover:underline" onClick={()=>setActive("surat")}>Kop Surat</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Kontak</p>
            <p className="text-gray-600 flex items-center gap-2"><Phone className="w-4 h-4"/>{profile.phone}</p>
            <p className="text-gray-600 flex items-center gap-2"><Mail className="w-4 h-4"/>{profile.email}</p>
            <p className="text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4"/>{profile.address}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ icon: Icon, label, id, active, setActive }) {
  const isActive = active === id;
  return (
    <button onClick={()=>setActive(id)} className={`px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`}>
      <Icon className="w-4 h-4"/>
      {label}
    </button>
  );
}
