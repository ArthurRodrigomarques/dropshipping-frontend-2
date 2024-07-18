"use client";

import { useContext, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/services/AuthContext";
import { useSearchParams } from "next/navigation";

export default function CreateProduct() {
  const { token } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("draft");
  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      if (filesArray.length > 0) {
        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = filesArray[0]; 
          return newImages;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("amount", amount);
    formData.append("status", status);
    images.forEach((image) => formData.append("images", image));

    const idAdm = process.env.NEXT_PUBLIC_ID_ADM;

    try {
      const response = await axios.post(
        `http://localhost:3333/product/${idAdm}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Product created:", response.data);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/adminproducts">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Novo Produto
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          Em estoque
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Descartar
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Salvar Produto
          </Button>
        </div>
      </div>
      <form
        className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
        onSubmit={handleSubmit}
      >
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Detalhes do Produto</CardTitle>
              <CardDescription>
                Coloque as informações do produto abaixo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    placeholder="Nome do Produto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrição do Produto"
                    className="min-h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-07-chunk-1">
            <CardHeader>
              <CardTitle>Estoque</CardTitle>
              <CardDescription>Quantidade e preço do produto</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">GGPC-001</TableCell>
                    <TableCell>
                      <Label htmlFor="amount" className="sr-only">
                        Quantidade
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="32"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Label htmlFor="price" className="sr-only">
                        Preço
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="99.99"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card className="lg:col-span-1 lg:grid lg:grid-cols-1 lg:items-start lg:gap-4">
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
            <CardDescription>Adicione imagens do produto abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
            <div>
  <Label htmlFor="images">Escolha as Imagens</Label>
  <div className="grid grid-cols-1 gap-4">
    {[...Array(5)].map((_, index) => (
      <Input
        key={index}
        id={`image_${index}`}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, index)}
      />
    ))}
  </div>
  {images.length > 0 && (
    <ul>
      {images.map((image, index) => (
        <li key={index}>{image.name}</li>
      ))}
    </ul>
  )}
</div>
              <div className="grid gap-2">
                {images.map((image, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Product Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-07-chunk-3">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Selecione o status do produto</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setName("");
                setDescription("");
                setPrice("");
                setAmount("");
                setImages([]);
              }}
            >
              Descartar
            </Button>
            <Button type="submit">Salvar Produto</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
