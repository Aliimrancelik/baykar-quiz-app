'use client'
import { useState, useEffect } from "react";

interface Soru {
  userId: number;
  id: number;
  title: string;
  body: string;
  cozuldu: number;
  cevap: number;
  shiklar: any;
}

export default function Home() {
  const shik_liste = ["A", "B", "C", "D"]
  const quiz_sure = 30
  const [sorular_liste, SetSorular] = useState<Soru[]>([]);
  const [aktif_sure, SetSure] = useState(quiz_sure);
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => {
        SetSorular(data.slice(0, 10).map((i: any) => {
          let shiklar = []
          let kelimeler = i.body.split(' ')
          for(let s = 0; s < 4; s++) shiklar.push(kelimeler[Math.floor(Math.random() * kelimeler.length)])
          return { ...i, cozuldu: 0, cevap: null, shiklar: shiklar }
        }));
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  function sonuc_goster(){
    document.getElementById("sonuc_tablo")?.classList.remove("hidden")
  }
  
  function soru_coz(id: any, cevap: number){
    SetSorular(s => s.map((item, index) => {
      if(item.id == id && (item.shiklar[cevap] || cevap == -1)){
        item.cevap = cevap
        item.cozuldu = 1
        if(index == s.length - 1) sonuc_goster();
      }
      return item
    }))
  }
  return (
    <div>
      <div className="flex gap-[10px] py-5 justify-center">
      {
        sorular_liste.map(s => {
          return (
            <div className={`w-[64px] h-[64px]  rounded-[100%] text-center leading-[64px] ${s.cozuldu ? 'bg-[#757373]' : 'bg-[#f0f0f0]'}`}>{s.id}</div>
          )
        })
      }
      </div>
      <div className="bg-[#f0f0f0]">
      {
        sorular_liste.map((s, index) => {
          let siradakiSoru = sorular_liste.find((soru: any) => soru.cozuldu === 0)
          return siradakiSoru && s.id == siradakiSoru.id ? (
            <div>
              <div className={`w-[500px]  rounded-[10px] text-center font-bold py-20 m-auto`}>{s.id} ) {s.body}
              <div className="mt-10 flex gap-5 justify-center">
              {
                s.shiklar.map((ss: any, index: number) => {
                  return (
                    <button className="px-10 h-[70px] bg-white font-bold" onClick={() => { soru_coz(s.id, index) }}>{shik_liste[index]}) {ss}</button>
                  )
                })
              }
              <button className="px-10 h-[70px] bg-white font-bold" onClick={() => { soru_coz(s.id, -1) }}>-1</button>
              </div>
              </div>
            </div>
          ) : null
        })
      }
      </div>
      <table id="sonuc_tablo" className="hidden m-auto my-20 shadow-2xl rounded-[20px] relative overflow-hidden text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Soru</th>
            <th scope="col" className="px-6 py-3">Şıklar</th>
            <th scope="col" className="px-6 py-3">Çözüldü</th>
            <th scope="col" className="px-6 py-3">Cevap</th>
          </tr>
        </thead>
        <tbody>
          {
            sorular_liste.map(s => {
              return (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{s.id}</td>
                <td className="px-6 py-4">{s.body}</td>
                <td className="px-6 py-4">{s.shiklar.join(", ")}</td>
                <td className="px-6 py-4">{s.cozuldu}</td>
                <td className="px-6 py-4">{s.cevap == -1 ? "BOŞ" : s.shiklar[s.cevap]}</td>
              </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}
