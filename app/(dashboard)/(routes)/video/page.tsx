"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import {  VideoIcon } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import  Empty from "@/components/empty";
import { useProModal } from "@/app/hooks/use-pro-modal";

import { formSchema } from "./constants";

const VideoPage = () => {
  const proModal = useProModal(); 
  const router = useRouter();
  const [video, setVideo] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post('/api/video', values);
      console.log(response)

      setVideo(response.data[0]);
      form.reset();
    } catch (error: any) {
      if(error?.response?.status === 403){
        proModal.onOpen();
    }
        console.error(error);
    } finally {
      router.refresh();
    }
  }

  return ( 
    <div>
      <Heading
        title="Video Generation"
        description="당신의 프롬프트를 비디오로 만들어보세요!"
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading} 
                      placeholder="강물에서 헤엄치는 연어를 보고 싶어요." 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
              Generate
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!video && !isLoading && (
          <Empty label="No video generated." />
        )}
        {video&& (
          <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black" >
            <source src={video} />
          </video>
        )}
      </div>
    </div>
   );
}
 
export default VideoPage;