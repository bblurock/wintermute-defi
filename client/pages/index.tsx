import Head from 'next/head'
import { Component } from 'react'
import styled from '@emotion/styled'

import { Button, Box, Center } from '@chakra-ui/react';
import Link from 'next/link'

import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Greeter from '../components/Greeter'

function Home() {
  const title = 'OSE Finance - Community-led asset management'

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Community Governance Asset Management Fund
        </h1>

        <p className={styles.description}>
          Create your own fund with OSE Vault today and deoploye your best crosschaing De-Fi strategies.
        </p>

        <Box w="100%" p={6}>
          <Center>
            <Link href="/vault" passHref>
              <Button colorScheme="teal" size="lg">
                Create Vault
              </Button>
            </Link>
          </Center>
        </Box>

      </main>

    </Layout>
  )
}

export default Home
