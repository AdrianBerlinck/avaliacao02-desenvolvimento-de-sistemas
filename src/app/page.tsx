'use client'
import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from 'uuid';

type Item = {
  id: string;
  text: string;
  checked: boolean;
}

export default function MakeList() {

  const [item, setItem] = useState('');
  const [itens, setItens] = useState<Item[]>([]);

  const disabled_button = !item;

  useEffect(() => {
    async function fetchItens() {
      try {
        const response = await axios.get("http://localhost:3001/itens");
        setItens(response.data);
      } catch (error) {
        console.error("Erro ao buscar os itens:", error);
      }
    }

    fetchItens();
  }, []);

  async function HandleSubmit(event: FormEvent) {
    event.preventDefault();

    const novoItem: Item = {
      id: uuid(),
      text: item,
      checked: false
    };

    try {
      await axios.post("http://localhost:3001/itens", novoItem);
      setItens(prev => [...prev, novoItem]);
      setItem('');
    } catch (error) {
      console.error('Erro ao enviar produto:', error);
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={HandleSubmit}>
          <h1>MakeList</h1>
          <div className='input'>
            <input
              type="text"
              id='item'
              placeholder='Informe o item'
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='button-cadastrar' disabled={disabled_button}>
            Salvar
          </button>
        </form>
      </div>

      <h1>Lista</h1>
      <ul>
        {itens.map((it) => (
          <li key={it.id}>
            <input type="checkbox" />
            {it.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
